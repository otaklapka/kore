import { assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import { ContainerResourceDefinition } from "../src/k8s/container_resource_definition.ts";
import { UnitUtil } from "../src/util/unit_util.ts";

Deno.test("Should parse all fields", async ({ step }) => {
  await step("Should parse all fields when defined", () => {
    const doc = parse(`
        name: my-name
    `);

    const metadata = Metadata.from(doc);
    assertEquals(metadata.name, "my-name");
  });

  await step("Should parse name as quoted string", () => {
    const doc = parse(`
        name: "my-name"
    `);

    const metadata = Metadata.from(doc);
    assertEquals(metadata.name, "my-name");
  });

  await step("Should parse annotations", () => {
    const doc = parse(`
        name: "my-name"
        annotations:
          foo: baz
          numFoo: 1
    `);

    const metadata = Metadata.from(doc);
    assertEquals(metadata.getAnnotation("foo"), "baz");
    assertEquals(metadata.getAnnotation("numFoo"), 1);
    assertEquals(metadata.hasOwnerReferences(), false);
  });

  await step("Should parse ownerReferences", () => {
    const doc = parse(`
        name: "my-name"
        ownerReferences:
          - apiVersion: batch/v1
            blockOwnerDeletion: true
            controller: true
            kind: CronJob
            name: pn-event-service-cron-event-prune
            uid: 13b36d2c-4299-43fa-a2e0-dff4043757d4
    `);

    const metadata = Metadata.from(doc);
    assertEquals(metadata.hasOwnerReferences(), true);
  });
});
