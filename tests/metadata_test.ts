import { assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import {ContainerResourceDefinition} from "../src/k8s/container_resource_definition.ts";
import {UnitUtil} from "../src/util/unit_util.ts";

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
});
