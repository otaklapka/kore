import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import { Pvc } from "../src/k8s/pvc.ts";
import { PvcResourceDefinition } from "../src/k8s/pvc_resource_definition.ts";

Deno.test("Should parse PVC", async ({ step }) => {
  await step("Should parse all fields when defined", () => {
    const doc = parse(`
        kind: PersistentVolumeClaim
        metadata:
          name: my-pvc
        spec:
          resources:
            requests:
              storage: 5Gi
    `);

    const pvc = Pvc.from(doc);
    assert(pvc.metadata instanceof Metadata);
    assert(pvc.requests instanceof PvcResourceDefinition);
    assert(pvc.requests instanceof PvcResourceDefinition);
  });
});
