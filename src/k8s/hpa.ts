import { Metadata, metadataSchema } from "./metadata.ts";
import { ScaleTargetRef, scaleTargetRefSchema } from "./scale_target_ref.ts";
import { Kind } from "../types.ts";
import { Scalable } from "./scalable.ts";
import { z } from "zod";

export const hpaSchema = z.object({
  kind: z.enum([Kind.HorizontalPodAutoscaler]),
  metadata: metadataSchema,
  spec: z.object({
    scaleTargetRef: scaleTargetRefSchema,
    maxReplicas: z.number(),
    minReplicas: z.number().optional(),
  }),
});

export class Hpa {
  public readonly kind = Kind.HorizontalPodAutoscaler;
  constructor(
    public readonly metadata: Metadata,
    public readonly scaleTargetRef: ScaleTargetRef,
    public readonly maxReplicas: number,
    public readonly minReplicas: number = 1,
  ) {}

  static from(data: unknown): Hpa {
    const hpaObj: z.infer<typeof hpaSchema> = hpaSchema.parse(data);

    const metadata = Metadata.from(hpaObj.metadata);
    const scaleTargetRef = ScaleTargetRef.from(hpaObj.spec.scaleTargetRef);

    return new Hpa(
      metadata,
      scaleTargetRef,
      hpaObj.spec.maxReplicas,
      hpaObj.spec.minReplicas,
    );
  }

  public match(target: Scalable): boolean {
    return this.scaleTargetRef.match(target);
  }
}
