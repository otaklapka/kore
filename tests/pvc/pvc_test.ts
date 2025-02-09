import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../../src/k8s/metadata.ts";
import { Pvc } from "../../src/k8s/pvc.ts";
import { PvcResourceDefinition } from "../../src/k8s/pvc_resource_definition.ts";
import { fullDefinedPvcInfo } from "./pvcs_info.ts";
import { fullDefinedPvcDefinition } from "./mod.ts";

Deno.test("Should parse PVC", async ({ step }) => {
  await step("Should parse all fields when defined", () => {
    const pvc = Pvc.from(fullDefinedPvcDefinition);
    assert(pvc.metadata instanceof Metadata);
    assert(pvc.requests instanceof PvcResourceDefinition);
    assert(pvc.requests instanceof PvcResourceDefinition);
    assertEquals(pvc.toJSON(), fullDefinedPvcInfo);
  });
});
