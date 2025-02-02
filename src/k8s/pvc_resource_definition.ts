import { UnitUtil } from "../util/unit_util.ts";
import { ContainerResourceDefinition } from "./container_resource_definition.ts";

export class PvcResourceDefinition {
  constructor(
    public readonly storageBytes: number,
  ) {
  }
  static from(data: any): PvcResourceDefinition {
    if (
      typeof data === "object" &&
      typeof data.storage === "string"
    ) {
      return new PvcResourceDefinition(
        UnitUtil.parseMemoryBytes(data.storage),
      );
    }

    throw new Error("Invalid pvc resource definition object");
  }

  public add(other: PvcResourceDefinition): PvcResourceDefinition {
    return new PvcResourceDefinition(this.storageBytes + other.storageBytes);
  }

  public multiply(n: number): PvcResourceDefinition {
    return new PvcResourceDefinition(this.storageBytes * n);
  }
}
