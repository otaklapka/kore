import { UnitUtil } from "../util/unit_util.ts";
import { z } from "zod";

export const pvcResourceDefinitionSchema = z.object({
  storage: z.string(),
});

export class PvcResourceDefinition {
  constructor(
    public readonly storageBytes: number,
  ) {
  }
  static from(data: unknown): PvcResourceDefinition {
    const pvcObj: z.infer<typeof pvcResourceDefinitionSchema> =
      pvcResourceDefinitionSchema.parse(data);

    return new PvcResourceDefinition(
      UnitUtil.parseMemoryBytes(pvcObj.storage),
    );
  }

  public add(other: PvcResourceDefinition): PvcResourceDefinition {
    return new PvcResourceDefinition(this.storageBytes + other.storageBytes);
  }

  public multiply(n: number): PvcResourceDefinition {
    return new PvcResourceDefinition(this.storageBytes * n);
  }
}
