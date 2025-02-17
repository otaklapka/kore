import { Metadata, metadataSchema } from "./metadata.ts";
import { Container, containerSchema } from "./container.ts";
import { IntoResourceAccumulator } from "./into_resource_accumulator.ts";
import { JobInfo, Kind, ToJson } from "../types.ts";
import { z } from "zod";

export const jobSchema = z.object({
  kind: z.enum([Kind.Job]),
  metadata: metadataSchema,
  spec: z.object({
    template: z.object({
      spec: z.object({
        containers: z.array(containerSchema),
      }),
    }),
  }),
});

export class Job extends IntoResourceAccumulator implements ToJson {
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

  static from(data: unknown): Job {
    const jobObj: z.infer<typeof jobSchema> = jobSchema.parse(data);

    const metadata = Metadata.from(jobObj.metadata);
    const containers = jobObj.spec.template.spec.containers
      .map((container) => Container.from(container));
    return new Job(metadata, containers);
  }

  public toJSON(): JobInfo {
    const { cpuMillis: limitsCpuMillis, memoryBytes: limitsMemoryBytes } = this
      .getContainerLimitsSum().multiply(this.getMaxReplicas());
    const { cpuMillis: requestsCpuMillis, memoryBytes: requestsMemoryBytes } =
      this.getContainerRequestsSum().multiply(this.getMaxReplicas());

    return {
      name: this.metadata.name,
      containers: this.containers.map((container) => container.toJSON()),
      kind: Kind.Job,
      resourcesSum: {
        limitsCpuMillis,
        limitsMemoryBytes,
        requestsCpuMillis: requestsCpuMillis ?? 0,
        requestsMemoryBytes: requestsMemoryBytes ?? 0,
      },
    };
  }

  public isSpawnedByCronJob(): boolean {
    return this.metadata.hasOwnerReferences();
  }
}
