import { ContainerResourceDefinition } from "./k8s/container_resource_definition.ts";
import { PvcResourceDefinition } from "./k8s/pvc_resource_definition.ts";

export class ResourceAccumulator {
  private containerRequests: ContainerResourceDefinition;
  private containerLimits: ContainerResourceDefinition;
  private pvcRequests: PvcResourceDefinition;

  constructor() {
    this.containerRequests = new ContainerResourceDefinition(0, 0);
    this.containerLimits = new ContainerResourceDefinition(
      undefined,
      undefined,
    );
    this.pvcRequests = new PvcResourceDefinition(0);
  }

  public accumulateContainerRequests(
    containerRequests: ContainerResourceDefinition,
  ): void {
    this.containerRequests = this.containerRequests.add(containerRequests);
  }

  public accumulateContainerLimits(
    containerLimits: ContainerResourceDefinition,
  ): void {
    this.containerLimits = this.containerLimits.add(containerLimits);
  }

  public accumulatePvcRequests(pvcRequests: PvcResourceDefinition): void {
    this.pvcRequests = this.pvcRequests.add(pvcRequests);
  }

  public getContainerRequests(): ContainerResourceDefinition {
    return this.containerRequests;
  }

  public getContainerLimits(): ContainerResourceDefinition {
    return this.containerLimits;
  }

  public getPvcRequests(): PvcResourceDefinition {
    return this.pvcRequests;
  }
}
