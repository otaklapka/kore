import { Hpa } from "./k8s/hpa.ts";
import { Deployment } from "./k8s/deployment.ts";
import { StatefulSet } from "./k8s/stateful_set.ts";
import { CronJob } from "./k8s/cron_job.ts";
import { InfoObject, Kind, KoreInfo, KubeObject } from "./types.ts";
import { Pvc } from "./k8s/pvc.ts";
import { ResourceAccumulator } from "./resource_accumulator.ts";

export class Kore {
  private readonly kubeObjects: KubeObject[];
  constructor(docs: Record<string, any>[]) {
    this.kubeObjects = this.parse(docs);
  }

  private parse(objects: Record<string, any>[]): KubeObject[] {
    return objects.reduce((acu: KubeObject[], obj) => {
      for (const parser of [Deployment, StatefulSet, CronJob, Pvc, Hpa]) {
        try {
          acu.push(parser.from(obj));
          return acu;
        } catch {}
      }
      return acu;
    }, []);
  }

  public intoInfo(): KoreInfo {
    const hpas = this.kubeObjects.filter((kubeObject) =>
      kubeObject.kind === Kind.HorizontalPodAutoscaler
    );

    const resourcesAccumulator = new ResourceAccumulator();

    const infoObjects = this.kubeObjects.reduce(
      (acc: InfoObject[], kubeObj) => {
        if ("intoInfo" in kubeObj) {
          if (kubeObj.kind === Kind.Deployment) {
            const matchedHpa = hpas.find((hpa) => hpa.match(kubeObj));
            if (matchedHpa) {
              kubeObj.setHpa(matchedHpa);
            }
          }
          kubeObj.intoResourceAccumulator(resourcesAccumulator);
          acc.push(kubeObj.intoInfo());
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
