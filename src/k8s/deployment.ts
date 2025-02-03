import { Metadata } from "./metadata.ts";
import { Container } from "./container.ts";
import { IntoResourceAccumulator } from "./into_resource_accumulator.ts";
import { DeploymentInfo, Kind } from "../types.ts";
import { Hpa } from "./hpa.ts";

export class Deployment extends IntoResourceAccumulator {
  public readonly kind = Kind.Deployment;
  private hpa: Hpa | undefined;

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

  public setHpa(hpa: Hpa): void {
    this.hpa = hpa;
  }

  public getHpa(): Hpa | undefined {
    return this.hpa;
  }

  protected getContainers(): Container[] {
    return this.containers;
  }

  protected getMaxReplicas(): number {
    return this.hpa ? this.hpa.maxReplicas : this.replicas;
  }

  public intoInfo(): DeploymentInfo {
    const { cpuMillis: limitsCpuMillis, memoryBytes: limitsMemoryBytes } = this
      .getContainerLimitsSum().multiply(this.getMaxReplicas());
    const { cpuMillis: requestsCpuMillis, memoryBytes: requestsMemoryBytes } =
      this.getContainerRequestsSum().multiply(this.getMaxReplicas());

    return {
      name: this.metadata.name,
      minReplicas: this.hpa ? this.hpa.minReplicas : this.replicas,
      maxReplicas: this.getMaxReplicas(),
      containers: this.containers,
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
