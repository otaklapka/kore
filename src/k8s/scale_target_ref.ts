import { Scalable } from "./scalable.ts";

export class ScaleTargetRef {
  constructor(
    public readonly kind: string,
    public readonly name: string,
  ) {}

  public static from(data: any): ScaleTargetRef {
    if (
      typeof data === "object" &&
      typeof data.kind === "string" &&
      typeof data.name === "string"
    ) {
      return new ScaleTargetRef(data.kind, data.name);
    }
    throw new Error("Invalid scale target ref object");
  }

  public match(target: Scalable): boolean {
    return target.kind === this.kind && target.metadata.name === this.name;
  }
}
