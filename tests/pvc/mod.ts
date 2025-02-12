import { parseAll } from "@std/yaml";
import { assert } from "@std/assert";

const yaml = await Deno.readTextFile("./tests/pvc/pvcs.yaml");
const parsed = parseAll(yaml) as unknown[];

assert(parsed.length === 3);

export const fullDefinedPvcDefinition = parsed[0];
export const fullDefinedSecondPvcDefinition = parsed[1];
export const pvcNotMatchingAnyStsDefinition = parsed[2];

export * from "./pvcs_info.ts";
