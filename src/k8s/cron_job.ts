import { Metadata } from "./metadata.ts";
import { Container } from "./container.ts";
import { ResourceRequestor } from "./resource_requestor.ts";
import { CronJobInfo, Kind } from "../types.ts";
import { ResourceAccumulator } from "../resource_accumulator.ts";

export class CronJob extends ResourceRequestor {
  public readonly kind = Kind.CronJob;
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

  static from(data: any): CronJob {
    if (
      typeof data === "object" &&
      data.kind === Kind.CronJob &&
      Array.isArray(data.spec?.jobTemplate?.spec?.template?.spec?.containers)
    ) {
      const metadata = Metadata.from(data.metadata);
      const containers =
        (data.spec.jobTemplate.spec.template.spec.containers as Array<
          Record<string, any>
        >)
          .map((container) => Container.from(container));
      return new CronJob(metadata, containers);
    }

    throw new Error("Invalid cron job object");
  }

  public intoInfo(): CronJobInfo {
    const { cpuMillis: limitsCpuMillis, memoryBytes: limitsMemoryBytes } = this
      .getContainerLimitsSum().multiply(this.getMaxReplicas());
    const { cpuMillis: requestsCpuMillis, memoryBytes: requestsMemoryBytes } =
      this.getContainerRequestsSum().multiply(this.getMaxReplicas());

    return {
      name: this.metadata.name,
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
