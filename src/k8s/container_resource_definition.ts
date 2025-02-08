import { ContainerResourceDefinitionInfo, ToJson } from "../types.ts";
import { UnitUtil } from "../util/unit_util.ts";

export class ContainerResourceDefinition implements ToJson {
  constructor(
    public readonly cpuMillis?: number,
    public readonly memoryBytes?: number,
  ) {}

  static fromRequests(data: any): ContainerResourceDefinition {
    return this.from(data, 0);
  }

  static fromLimits(data: any): ContainerResourceDefinition {
    return this.from(data, undefined);
  }

  static from(
    data: any,
    defaultValue: 0 | undefined,
  ): ContainerResourceDefinition {
    if (
      (!data?.cpu ||
        (typeof data?.cpu === "string" || typeof data?.cpu === "number")) &&
      (!data?.memory ||
        (typeof data?.memory === "string" || typeof data?.memory === "number"))
    ) {
      const cpu = data?.cpu
        ? UnitUtil.parseCpuMillis(data.cpu.toString())
        : defaultValue;
      const memory = data?.memory
        ? UnitUtil.parseMemoryBytes(data.memory.toString())
        : defaultValue;

      return new ContainerResourceDefinition(cpu, memory);
    }

    throw new Error("Invalid input data");
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
