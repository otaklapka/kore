import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import { Pvc } from "../src/k8s/pvc.ts";
import { PvcResourceDefinition } from "../src/k8s/pvc_resource_definition.ts";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
        apiVersion: v1
        kind: PersistentVolumeClaim
        metadata:
          name: my-pvc
          namespace: default
        spec:
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 5Gi
            limits:
              storage: 5Gi
    `);

  const pvc = Pvc.from(yml);
  assert(pvc.metadata instanceof Metadata);
  assert(pvc.requests instanceof PvcResourceDefinition);
  assert(pvc.limits instanceof PvcResourceDefinition);
});

Deno.test("Limits should be optional", () => {
  const yml = parse(`
        apiVersion: v1
        kind: PersistentVolumeClaim
        metadata:
          name: my-pvc
          namespace: default
        spec:
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 5Gi
    `);

  const pvc = Pvc.from(yml);
  assert(pvc.metadata instanceof Metadata);
  assert(pvc.requests instanceof PvcResourceDefinition);
  assertEquals(pvc.limits, undefined);
});
