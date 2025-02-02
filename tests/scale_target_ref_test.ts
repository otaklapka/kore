import { assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { ScaleTargetRef } from "../src/k8s/scale_target_ref.ts";

Deno.test("Should parse all scaleTargetRef fields", () => {
  const yml = parse(`
        apiVersion: apps/v1
        kind: Deployment
        name: my-deployment-with-hpa
    `);

  const scaleTargetRef = ScaleTargetRef.from(yml);
  assertEquals(scaleTargetRef.name, "my-deployment-with-hpa");
  assertEquals(scaleTargetRef.kind, "Deployment");
});
