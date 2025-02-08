import { ContainerResourceDefinitionInfo, ToJson } from "../types.ts";
import { UnitUtil } from "../util/unit_util.ts";
import { z } from "zod";

export const containerResourceDefinitionSchema = z.object({
  memory: z.string().optional(),
  cpu: z.string().or(z.number()).optional(),
}).optional().nullable();

export class ContainerResourceDefinition implements ToJson {
  constructor(
    public readonly cpuMillis?: number,
    public readonly memoryBytes?: number,
  ) {}

  static fromRequests(data: unknown): ContainerResourceDefinition {
    return this.from(data, 0);
  }

  static fromLimits(data: unknown): ContainerResourceDefinition {
    return this.from(data, undefined);
  }

  static from(
    data: unknown,
    defaultValue: 0 | undefined,
  ): ContainerResourceDefinition {
    const containerResourceDefinitionObj: z.infer<
      typeof containerResourceDefinitionSchema
    > = containerResourceDefinitionSchema.parse(data);

    const cpu = containerResourceDefinitionObj?.cpu
      ? UnitUtil.parseCpuMillis(containerResourceDefinitionObj.cpu.toString())
      : defaultValue;
    const memory = containerResourceDefinitionObj?.memory
      ? UnitUtil.parseMemoryBytes(
        containerResourceDefinitionObj.memory.toString(),
      )
      : defaultValue;

    return new ContainerResourceDefinition(cpu, memory);
  }

  public add(other: ContainerResourceDefinition): ContainerResourceDefinition {
    const cpu = other.cpuMillis === undefined || this.cpuMillis === undefined
      ? undefined
      : other.cpuMillis + this.cpuMillis;
    const memory =
      other.memoryBytes === undefined || this.memoryBytes === undefined
        ? undefined
        : other.memoryBytes + this.memoryBytes;

    return new ContainerResourceDefinition(cpu, memory);
  }

  public multiply(n: number): ContainerResourceDefinition {
    const cpu = this.cpuMillis !== undefined ? this.cpuMillis * n : undefined;
    const memory = this.memoryBytes !== undefined
      ? this.memoryBytes * n
      : undefined;

    return new ContainerResourceDefinition(cpu, memory);
  }

  public toJSON(): ContainerResourceDefinitionInfo {
    return {
      cpuMillis: this.cpuMillis,
      memoryBytes: this.memoryBytes,
    };
  }
}
