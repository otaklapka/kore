import { Metadata } from "./metadata.ts";
import { Container } from "./container.ts";
import { IntoResourceAccumulator } from "./into_resource_accumulator.ts";
import { JobInfo, Kind } from "../types.ts";

export class Job extends IntoResourceAccumulator {
  public readonly kind = Kind.Job;
  constructor(
    public readonly metadata: Metadata,
    public readonly containers: Container[],
  ) {
    super();
  }

  protected getContainers(): Container[] {
    return this.containers;
  }

  protected getMaxReplicas(): number {
    return 1;
  }

  static from(data: any): Job {
    if (
      typeof data === "object" &&
      data.kind === Kind.Job &&
      Array.isArray(data.spec?.template?.spec?.containers)
    ) {
      const metadata = Metadata.from(data.metadata);
      const containers = (data.spec.template.spec.containers as Array<
        Record<string, any>
      >)
        .map((container) => Container.from(container));
      return new Job(metadata, containers);
    }

    throw new Error("Invalid cron job object");
  }

  public intoInfo(): JobInfo {
    const { cpuMillis: limitsCpuMillis, memoryBytes: limitsMemoryBytes } = this
      .getContainerLimitsSum().multiply(this.getMaxReplicas());
    const { cpuMillis: requestsCpuMillis, memoryBytes: requestsMemoryBytes } =
      this.getContainerRequestsSum().multiply(this.getMaxReplicas());

    return {
      name: this.metadata.name,
      containers: this.containers.map((container) => container.intoInfo()),
      kind: Kind.Job,
      resourcesSum: {
        limitsCpuMillis,
        limitsMemoryBytes,
        requestsCpuMillis: requestsCpuMillis ?? 0,
        requestsMemoryBytes: requestsMemoryBytes ?? 0,
      },
    };
  }
}
