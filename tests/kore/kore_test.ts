import { Kore } from "../../src/kore.ts";
import { assertEquals } from "@std/assert";
import { defaultDefinedKoreInfo, fullDefinedKoreInfo } from "./kore_info.ts";
import { defaultKoreDefinitions, fullDefinedKoreDefinitions } from "./mod.ts";

Deno.test("Should extract resources from all resources", async ({ step }) => {
  await step("Full defined", () => {
    const kore = new Kore(fullDefinedKoreDefinitions);

    assertEquals(kore.toJSON(), fullDefinedKoreInfo);
  });

  await step("Default values", () => {
    const kore = new Kore(defaultKoreDefinitions);

    assertEquals(kore.toJSON(), defaultDefinedKoreInfo);
  });
});
