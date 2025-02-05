import { Metadata } from "./metadata.ts";
import { ScaleTargetRef } from "./scale_target_ref.ts";
import { Kind } from "../types.ts";
import { Scalable } from "./scalable.ts";

export class Hpa {
  public readonly kind = Kind.HorizontalPodAutoscaler;
  constructor(
    public readonly metadata: Metadata,
    public readonly scaleTargetRef: ScaleTargetRef,
    public readonly maxReplicas: number,
    public readonly minReplicas: number = 1,
  ) {}

  static from(data: any): Hpa {
    if (
      typeof data === "object" &&
      data.kind === Kind.HorizontalPodAutoscaler &&
      typeof data.spec?.maxReplicas === "number"
    ) {
      const metadata = Metadata.from(data.metadata);
      const scaleTargetRef = ScaleTargetRef.from(data.spec?.scaleTargetRef);
      return new Hpa(
        metadata,
        scaleTargetRef,
        data.spec.maxReplicas,
        data.spec.minReplicas,
      );
    }

    throw new Error("Invalid hpa object");
  }

  public match(target: Scalable): boolean {
    return this.scaleTargetRef.match(target);
  }
}
