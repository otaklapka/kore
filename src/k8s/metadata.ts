import { z } from "zod";
import { ScaleTargetRef, scaleTargetRefSchema } from "./scale_target_ref.ts";

export const metadataSchema = z.object({
  name: z.string(),
  annotations: z.record(z.string(), z.string().or(z.number())).optional(),
  ownerReferences: z.array(scaleTargetRefSchema).optional(),
});

export class Metadata {
  constructor(
    public readonly name: string,
    private readonly annotations: Map<string, string | number>,
    private readonly ownerReferences: ScaleTargetRef[] = [],
  ) {}

  static from(data: unknown): Metadata {
    const metadataObj: z.infer<typeof metadataSchema> = metadataSchema.parse(
      data,
    );

    const annotations = metadataObj.annotations
      ? new Map(Object.entries(metadataObj.annotations))
      : new Map();

    const ownerReferences = Array.isArray(metadataObj.ownerReferences)
      ? metadataObj.ownerReferences.map(ScaleTargetRef.from)
      : [];

    return new Metadata(metadataObj.name, annotations, ownerReferences);
  }

  public getAnnotation<T extends string | number>(key: string): T | undefined {
    return this.annotations.get(key) as T;
  }

  public hasOwnerReferences(): boolean {
    return !!this.ownerReferences.length;
  }
}
