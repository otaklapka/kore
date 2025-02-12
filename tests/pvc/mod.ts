import { parseAll } from "@std/yaml";
import { assert } from "@std/assert";

const yaml = await Deno.readTextFile("./tests/pvc/pvcs.yaml");
const parsed = parseAll(yaml) as unknown[];

assert(parsed.length === 4);

export const fullDefinedPvcDefinition = parsed[0];
export const fullDefinedStsMyPvcDefinition = parsed[1];
export const fullDefinedStsMySecondPvcDefinition = parsed[2];
export const pvcNotMatchingAnyStsDefinition = parsed[3];

export * from "./pvcs_info.ts";
