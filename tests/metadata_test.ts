import { assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
        name: my-name
    `);

  const metadata = Metadata.from(yml);
  assertEquals(metadata.name, "my-name");
});
