import { Metadata } from "./metadata.ts";
import { Container } from "./container.ts";
import { IntoResourceAccumulator } from "./into_resource_accumulator.ts";
import { DeploymentInfo, Kind, ToJson } from "../types.ts";
import { Hpa } from "./hpa.ts";
import { Scalable } from "./scalable.ts";

export class Deployment extends Scalable implements ToJson {
  public readonly kind = Kind.Deployment;

  constructor(
    public readonly metadata: Metadata,
    public readonly containers: Container[],
    public readonly replicas: number = 1,
  ) {
    super();
  }

  static from(data: any): Deployment {
    if (
      typeof data === "object" &&
      data.kind === Kind.Deployment &&
      Array.isArray(data.spec?.template?.spec?.containers)
    ) {
      const metadata = Metadata.from(data.metadata);
      const replicas = typeof data.spec?.replicas === "number"
        ? data.spec?.replicas
        : undefined;
      const containers =
        (data.spec.template.spec.containers as Array<Record<string, any>>)
          .map((container) => Container.from(container));
      return new Deployment(metadata, containers, replicas);
    }

    throw new Error("Invalid deployment object");
  }

  protected getContainers(): Container[] {
    return this.containers;
  }

  public toJSON(): DeploymentInfo {
    const { cpuMillis: limitsCpuMillis, memoryBytes: limitsMemoryBytes } = this
      .getContainerLimitsSum().multiply(this.getMaxReplicas());
    const { cpuMillis: requestsCpuMillis, memoryBytes: requestsMemoryBytes } =
      this.getContainerRequestsSum().multiply(this.getMaxReplicas());

    return {
      name: this.metadata.name,
      minReplicas: this.hpa ? this.hpa.minReplicas : this.replicas,
      maxReplicas: this.getMaxReplicas(),
      containers: this.containers.map((container) => container.toJSON()),
      kind: Kind.Deployment,
      resourcesSum: {
        limitsCpuMillis,
        limitsMemoryBytes,
        requestsCpuMillis: requestsCpuMillis ?? 0,
        requestsMemoryBytes: requestsMemoryBytes ?? 0,
      },
    };
  }
}
