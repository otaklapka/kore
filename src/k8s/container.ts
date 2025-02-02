import { ContainerResourceDefinition } from "./container_resource_definition.ts";

export class Container {
  constructor(
    public readonly name: string,
    public readonly requests: ContainerResourceDefinition,
    public readonly limits: ContainerResourceDefinition,
  ) {}

  static from(data: any): Container {
    if (
      typeof data === "object" &&
      typeof data.name === "string" &&
      (!data.resources || typeof data.resources === "object") &&
      (!data.resources?.requests ||
        typeof data.resources?.requests === "object") &&
      (!data.resources?.limits || typeof data.resources?.limits === "object")
    ) {
      const requests = ContainerResourceDefinition.fromRequests(
        data.resources?.requests,
      );
      const limits = ContainerResourceDefinition.fromLimits(
        data.resources?.limits,
      );
      return new Container(data.name, requests, limits);
    }

    throw new Error("Invalid input data");
  }
}
