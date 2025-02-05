import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { ScaleTargetRef } from "../src/k8s/scale_target_ref.ts";
import { Metadata } from "../src/k8s/metadata.ts";
import { Kind } from "../src/types.ts";
import { Deployment } from "../src/k8s/deployment.ts";

Deno.test("Should parse all scaleTargetRef fields", () => {
  const doc = parse(`
        apiVersion: apps/v1
        kind: Deployment
        name: my-deployment-with-hpa
    `);
  const deployDoc = parse(`
        kind: Deployment
        metadata:
          name: my-deployment-with-hpa
        spec:
          replicas: 3
          template:
            spec:
              containers:
                - name: my-container
    `);

  const scaleTargetRef = ScaleTargetRef.from(doc);
  const deployment = Deployment.from(deployDoc);

  assertEquals(scaleTargetRef.name, "my-deployment-with-hpa");
  assertEquals(scaleTargetRef.kind, "Deployment");
  assert(
    scaleTargetRef.match(deployment),
  );
});
