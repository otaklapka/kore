import { assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { PvcResourceDefinition } from "../src/k8s/pvc_resource_definition.ts";
import { UnitUtil } from "../src/util/unit_util.ts";
import { Metadata } from "../src/k8s/metadata.ts";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
        storage: 5Gi
    `);

  const pvcResourceDefinition = PvcResourceDefinition.from(yml);
  assertEquals(
    pvcResourceDefinition.storageBytes,
    UnitUtil.parseMemoryBytes("5Gi"),
  );
});
