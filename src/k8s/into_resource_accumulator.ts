import { Container } from "./container.ts";
import { ContainerResourceDefinition } from "./container_resource_definition.ts";
import { ResourceAccumulator } from "../resource_accumulator.ts";
import { Pvc } from "./pvc.ts";
import { PvcResourceDefinition } from "./pvc_resource_definition.ts";

export abstract class IntoResourceAccumulator {
  protected constructor() {}

  protected abstract getMaxReplicas(): number;
  protected abstract getContainers(): Container[];
  protected getPvcs(): Pvc[] {
    return [];
  }

  public getContainerLimitsSum(): ContainerResourceDefinition {
    return this.getContainers().reduce(
      (acu, container) => container.limits?.add(acu) || acu,
      new ContainerResourceDefinition(0, 0),
    );
  }

  public getContainerRequestsSum(): ContainerResourceDefinition {
    return this.getContainers().reduce(
      (acu, container) => container.requests?.add(acu) || acu,
      new ContainerResourceDefinition(0, 0),
    );
  }

  public getPvcRequestsSum(): PvcResourceDefinition {
    return this.getPvcs().reduce(
      (acu, pvc) => pvc.requests.add(acu) || acu,
      new PvcResourceDefinition(0),
    );
  }

  public intoResourceAccumulator(acc: ResourceAccumulator): void {
    acc.accumulateContainerRequests(
      this.getContainerRequestsSum().multiply(this.getMaxReplicas()),
    );
    acc.accumulateContainerLimits(
      this.getContainerLimitsSum().multiply(this.getMaxReplicas()),
    );
    acc.accumulatePvcRequests(
      this.getPvcRequestsSum().multiply(this.getMaxReplicas()),
    );
  }
}
