import { Scalable } from "./scalable.ts";
import { z } from "zod";

export const scaleTargetRefSchema = z.object({
  kind: z.string(),
  name: z.string(),
});

// TODO: rename just to TargetRef
export class ScaleTargetRef {
  constructor(
    public readonly kind: string,
    public readonly name: string,
  ) {}

  public static from(data: unknown): ScaleTargetRef {
    const scaleTargetRefObj: z.infer<typeof scaleTargetRefSchema> =
      scaleTargetRefSchema.parse(data);

    return new ScaleTargetRef(scaleTargetRefObj.kind, scaleTargetRefObj.name);
  }

  public match(target: Scalable): boolean {
    return target.kind === this.kind && target.metadata.name === this.name;
  }
}
