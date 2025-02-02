import { PvcResourceDefinition } from "./pvc_resource_definition.ts";
import { Metadata } from "./metadata.ts";
import { Kind, PvcInfo } from "../types.ts";
import { ResourceRequestor } from "./resource_requestor.ts";
import { Container } from "./container.ts";
import { ResourceAccumulator } from "../resource_accumulator.ts";

export class Pvc extends ResourceRequestor {
  public readonly kind = Kind.PersistentVolumeClaim;
  constructor(
    public readonly metadata: Metadata,
    public readonly requests: PvcResourceDefinition,
  ) {
    super();
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

  static from(data: any): Pvc {
    if (
      typeof data === "object" &&
      data.kind === Kind.PersistentVolumeClaim
    ) {
      const metadata = Metadata.from(data.metadata);
      const requests = PvcResourceDefinition.from(
        data.spec?.resources?.requests,
      );
      return new Pvc(metadata, requests);
    }

    throw new Error("Invalid pvc object");
  }

  public intoInfo(): PvcInfo {
    return {
      kind: Kind.PersistentVolumeClaim,
      name: this.metadata.name,
      resourcesSum: {
        requestsStorageBytes: this.requests.storageBytes,
      },
    };
  }
}
