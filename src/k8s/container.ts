import {
  ContainerResourceDefinition,
  containerResourceDefinitionSchema,
} from "./container_resource_definition.ts";
import { ContainerInfo, ToJson } from "../types.ts";
import { z } from "zod";

export const containerSchema = z.object({
  name: z.string(),
  resources: z.object({
    requests: containerResourceDefinitionSchema,
    limits: containerResourceDefinitionSchema,
  }).optional().nullable(),
});

export class Container implements ToJson {
  constructor(
    public readonly name: string,
    public readonly requests: ContainerResourceDefinition,
    public readonly limits: ContainerResourceDefinition,
  ) {}

  static from(data: unknown): Container {
    const containerObj: z.infer<typeof containerSchema> = containerSchema.parse(
      data,
    );

    const requests = ContainerResourceDefinition.fromRequests(
      containerObj.resources?.requests,
    );
    const limits = ContainerResourceDefinition.fromLimits(
      containerObj.resources?.limits,
    );

    return new Container(containerObj.name, requests, limits);
  }

  public toJSON(): ContainerInfo {
    return {
      name: this.name,
      requests: this.requests.toJSON(),
      limits: this.limits.toJSON(),
    };
  }
}
