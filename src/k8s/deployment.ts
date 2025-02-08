import { Metadata, metadataSchema } from "./metadata.ts";
import { Container, containerSchema } from "./container.ts";
import { DeploymentInfo, Kind, ToJson } from "../types.ts";
import { Scalable } from "./scalable.ts";
import { z } from "zod";

export const deploymentSchema = z.object({
  kind: z.enum([Kind.Deployment]),
  metadata: metadataSchema,
  spec: z.object({
    replicas: z.number().optional(),
    template: z.object({
      spec: z.object({
        containers: z.array(containerSchema),
      }),
    }),
  }),
});

export class Deployment extends Scalable implements ToJson {
  public readonly kind = Kind.Deployment;

  constructor(
    public readonly metadata: Metadata,
    public readonly containers: Container[],
    public readonly replicas: number = 1,
  ) {
    super();
  }

  static from(data: unknown): Deployment {
    const deploymentObj: z.infer<typeof deploymentSchema> = deploymentSchema
      .parse(data);

    const metadata = Metadata.from(deploymentObj.metadata);
    const containers = deploymentObj.spec.template.spec.containers
      .map((container) => Container.from(container));
    return new Deployment(metadata, containers, deploymentObj.spec.replicas);
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
