import { IntoResourceAccumulator } from "./into_resource_accumulator.ts";
import { Hpa } from "./hpa.ts";
import { Metadata } from "./metadata.ts";
import { Kind } from "../types.ts";

export abstract class Scalable extends IntoResourceAccumulator {
  protected hpa: Hpa | undefined;
  public abstract kind: Kind;
  public abstract replicas: number;
  public abstract metadata: Metadata;

  public setHpa(hpa: Hpa): void {
    this.hpa = hpa;
  }

  public getHpa(): Hpa | undefined {
    return this.hpa;
  }

  protected override getMaxReplicas(): number {
    return this.hpa ? this.hpa.maxReplicas : this.replicas;
  }
}
