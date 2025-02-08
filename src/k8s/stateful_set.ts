import { Metadata } from "./metadata.ts";
import { Container } from "./container.ts";
import { Pvc } from "./pvc.ts";
import { IntoResourceAccumulator } from "./into_resource_accumulator.ts";
import { Kind, StatefulSetInfo, ToJson } from "../types.ts";
import { Scalable } from "./scalable.ts";

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

  static from(data: any): StatefulSet {
    if (
      typeof data === "object" &&
      data.kind === Kind.StatefulSet &&
      Array.isArray(data.spec?.template?.spec?.containers) &&
      (!data.spec?.volumeClaimTemplates ||
        Array.isArray(data.spec?.volumeClaimTemplates))
    ) {
      const metadata = Metadata.from(data.metadata);
      const replicas = typeof data.spec?.replicas === "number"
        ? data.spec?.replicas
        : undefined;
      const containers =
        (data.spec.template.spec.containers as Array<Record<string, any>>)
          .map((container) => Container.from(container));
      const pvcs =
        ((data.spec?.volumeClaimTemplates || []) as Array<Record<string, any>>)
          .map((pvc) => Pvc.from({ kind: "PersistentVolumeClaim", ...pvc }));
      return new StatefulSet(metadata, containers, replicas, pvcs);
    }

    throw new Error("Invalid stateful set object");
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
      minReplicas: this.hpa ? this.hpa.minReplicas : this.replicas,
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
