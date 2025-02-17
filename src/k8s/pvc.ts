import {
  PvcResourceDefinition,
  pvcResourceDefinitionSchema,
} from "./pvc_resource_definition.ts";
import { Metadata, metadataSchema } from "./metadata.ts";
import { Kind, PvcInfo, ToJson } from "../types.ts";
import { IntoResourceAccumulator } from "./into_resource_accumulator.ts";
import { Container } from "./container.ts";
import { z } from "zod";

export const pvcSchema = z.object({
  kind: z.enum([Kind.PersistentVolumeClaim]),
  metadata: metadataSchema,
  spec: z.object({
    resources: z.object({
      requests: pvcResourceDefinitionSchema,
    }),
  }),
});

export class Pvc extends IntoResourceAccumulator implements ToJson {
  public readonly kind = Kind.PersistentVolumeClaim;
  constructor(
    public readonly metadata: Metadata,
    public readonly requests: PvcResourceDefinition,
    private readonly isBoundByConroller: boolean = false,
  ) {
    super();
  }

  public isBoundByController(): boolean {
    return !!this.metadata.getAnnotation(
      "pv.kubernetes.io/bound-by-controller",
    );
  }

  protected getContainers(): Container[] {
    return [];
  }

  protected getMaxReplicas(): number {
    return 1;
  }

  protected override getPvcs(): Pvc[] {
    return [this];
  }

  static from(data: unknown): Pvc {
    const pvcObj: z.infer<typeof pvcSchema> = pvcSchema.parse(data);

    const metadata = Metadata.from(pvcObj.metadata);
    const requests = PvcResourceDefinition.from(
      pvcObj.spec.resources.requests,
    );
    return new Pvc(metadata, requests);
  }

  public toJSON(): PvcInfo {
    return {
      kind: Kind.PersistentVolumeClaim,
      name: this.metadata.name,
      resourcesSum: {
        requestsStorageBytes: this.requests.storageBytes,
      },
    };
  }
}
