import { z } from "zod";

export const metadataSchema = z.object({
  name: z.string(),
});

export class Metadata {
  constructor(public readonly name: string) {}

  static from(data: unknown): Metadata {
    const metadataObj: z.infer<typeof metadataSchema> = metadataSchema.parse(
      data,
    );

    return new Metadata(metadataObj.name);
  }
}
