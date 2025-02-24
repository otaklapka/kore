import { Hpa } from "./k8s/hpa.ts";
import { Deployment } from "./k8s/deployment.ts";
import { StatefulSet } from "./k8s/stateful_set.ts";
import { CronJob } from "./k8s/cron_job.ts";
import {
  InfoObject,
  Kind,
  KoreInfo,
  KoreOptions,
  KubeObject,
  ToJson,
} from "./types.ts";
import { Pvc } from "./k8s/pvc.ts";
import { ResourceAccumulator } from "./resource_accumulator.ts";
import { Job } from "./k8s/job.ts";
import { Scalable } from "./k8s/scalable.ts";
import { z } from "zod";
import { metadataSchema } from "./k8s/metadata.ts";

const baseKubeObjSchema = z.object({
  kind: z.string(),
  metadata: metadataSchema,
});

export class Kore implements ToJson {
  private readonly kubeObjects: KubeObject[];
  constructor(docs: unknown[], private readonly options?: KoreOptions) {
    this.kubeObjects = this.parse(docs);
  }

  private parse(objects: unknown[]): KubeObject[] {
    return objects.reduce((acu: KubeObject[], obj) => {
      const startObjectsLen = acu.length;
      for (const parser of [Deployment, StatefulSet, CronJob, Pvc, Hpa, Job]) {
        try {
          acu.push(parser.from(obj));
          return acu;
        } catch {}
      }

      if (startObjectsLen === acu.length && this.options?.verbose) {
        const metadataObj = baseKubeObjSchema.safeParse(obj);
        if (metadataObj.success) {
          console.log(
            `Ignoring unsupported object ${metadataObj.data.kind} ${metadataObj.data.metadata.name}`,
          );
        } else {
          console.log(
            `Ignoring unknown probably non-kube object ${JSON.stringify(obj)}`,
          );
        }
      }
      return acu;
    }, []);
  }

  public toJSON(): KoreInfo {
    const hpas = this.kubeObjects.filter((kubeObject) =>
      kubeObject.kind === Kind.HorizontalPodAutoscaler
    );

    const resourcesAccumulator = new ResourceAccumulator();

    const infoObjects = this.kubeObjects.reduce(
      (acc: InfoObject[], kubeObj) => {
        if (
          kubeObj.kind === Kind.PersistentVolumeClaim &&
            kubeObj.isBoundByController() ||
          kubeObj.kind === Kind.Job && kubeObj.isSpawnedByCronJob()
        ) {
          if (this.options?.verbose) {
            console.log(
              `Ignoring ${kubeObj.kind} ${kubeObj.metadata.name} it is managed by controller`,
            );
          }
          return acc;
        }

        if ("toJSON" in kubeObj) {
          if (kubeObj instanceof Scalable) {
            const matchedHpa = hpas.find((hpa) => hpa.match(kubeObj));
            if (matchedHpa) {
              kubeObj.setHpa(matchedHpa);
            }
          }
          kubeObj.intoResourceAccumulator(resourcesAccumulator);
          acc.push(kubeObj.toJSON());
        }
        return acc;
      },
      [],
    );

    const { cpuMillis: limitsCpuMillis, memoryBytes: limitsMemoryBytes } =
      resourcesAccumulator.getContainerLimits();
    const { cpuMillis: requestsCpuMillis, memoryBytes: requestsMemoryBytes } =
      resourcesAccumulator.getContainerRequests();
    const { storageBytes: requestsStorageBytes } = resourcesAccumulator
      .getPvcRequests();

    return {
      objects: infoObjects,
      resourcesSum: {
        requestsCpuMillis: requestsCpuMillis ?? 0,
        requestsMemoryBytes: requestsMemoryBytes ?? 0,
        limitsCpuMillis,
        limitsMemoryBytes,
        requestsStorageBytes,
      },
    };
  }
}
