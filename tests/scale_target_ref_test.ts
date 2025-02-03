import { assertEquals, assert } from "@std/assert";
import { parse } from "@std/yaml";
import { ScaleTargetRef } from "../src/k8s/scale_target_ref.ts";
import {Metadata} from "../src/k8s/metadata.ts";
import { Kind } from "../src/types.ts";

Deno.test("Should parse all scaleTargetRef fields", () => {
  const doc = parse(`
        apiVersion: apps/v1
        kind: Deployment
        name: my-deployment-with-hpa
    `);

  const scaleTargetRef = ScaleTargetRef.from(doc);
  assertEquals(scaleTargetRef.name, "my-deployment-with-hpa");
  assertEquals(scaleTargetRef.kind, "Deployment");
  assert(scaleTargetRef.match({kind: Kind.Deployment, metadata: new Metadata("my-deployment-with-hpa")}))
});
