import { Metadata, metadataSchema } from "./metadata.ts";
import { Container, containerSchema } from "./container.ts";
import { Pvc } from "./pvc.ts";
import { Kind, StatefulSetInfo, ToJson } from "../types.ts";
import { Scalable } from "./scalable.ts";
import { z } from "zod";
import { pvcResourceDefinitionSchema } from "./pvc_resource_definition.ts";

export const statefulSetSchema = z.object({
  kind: z.enum([Kind.StatefulSet]),
  metadata: metadataSchema,
  spec: z.object({
    replicas: z.number().optional(),
    template: z.object({
      spec: z.object({
        containers: z.array(containerSchema),
      }),
    }),
    volumeClaimTemplates: z.array(z.object({
      metadata: metadataSchema,
      spec: z.object({
        resources: z.object({
          requests: pvcResourceDefinitionSchema,
        }),
      }),
    })).optional().nullable(),
  }),
});

export class StatefulSet extends Scalable implements ToJson {
  public readonly kind = Kind.StatefulSet;
  constructor(
    public readonly metadata: Metadata,
    public readonly containers: Container[],
    public readonly replicas: number = 1,
    public readonly pvcTemplates: Pvc[],
  ) {
    super();
  }

  protected getContainers(): Container[] {
    return this.containers;
  }

  protected override getPvcs(): Pvc[] {
    return this.pvcTemplates;
  }

  static from(data: unknown): StatefulSet {
    const statefulSetObj: z.infer<typeof statefulSetSchema> = statefulSetSchema
      .parse(data);

    const metadata = Metadata.from(statefulSetObj.metadata);
    const replicas = statefulSetObj.spec.replicas;
    const containers = statefulSetObj.spec.template.spec.containers
      .map((container) => Container.from(container));
    const pvcs = (statefulSetObj.spec.volumeClaimTemplates || [])
      .map((pvc) => Pvc.from({ kind: "PersistentVolumeClaim", ...pvc }));
    return new StatefulSet(metadata, containers, replicas, pvcs);
  }

  public holdsPvc(pvc: Pvc): boolean {
    return this.getPvcs().some((pvcTemplate) =>
      pvcTemplate.metadata.name === pvc.metadata.name
    );
  }

  public toJSON(): StatefulSetInfo {
    const { cpuMillis: limitsCpuMillis, memoryBytes: limitsMemoryBytes } = this
      .getContainerLimitsSum().multiply(this.getMaxReplicas());
    const { cpuMillis: requestsCpuMillis, memoryBytes: requestsMemoryBytes } =
      this.getContainerRequestsSum().multiply(this.getMaxReplicas());
    const { storageBytes: requestsStorageBytes } = this.getPvcRequestsSum()
      .multiply(this.getMaxReplicas());

    return {
      name: this.metadata.name,
      minReplicas: this.hpa ? this.hpa.minReplicas : 1,
      maxReplicas: this.getMaxReplicas(),
      containers: this.containers.map((container) => container.toJSON()),
      kind: Kind.StatefulSet,
      pvcs: this.pvcTemplates.map((pvc) => pvc.toJSON()),
      resourcesSum: {
        limitsCpuMillis,
        limitsMemoryBytes,
        requestsCpuMillis: requestsCpuMillis ?? 0,
        requestsMemoryBytes: requestsMemoryBytes ?? 0,
        requestsStorageBytes: requestsStorageBytes ?? 0,
      },
    };
  }
}
