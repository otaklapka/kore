import { parseAll } from "@std/yaml";
import { assert } from "@std/assert";

const yaml = await Deno.readTextFile("./tests/stateful_set/stateful_sets.yaml");
const parsed = parseAll(yaml) as unknown[];

assert(parsed.length === 5);

export const fullDefinedStatefulSetDefinition = parsed[0];
export const defaultContainersStatefulSetDefinition = parsed[1];
export const mixedDefinedContainersStatefulSetDefinition = parsed[2];
export const statefulSetWithHpaDefinition = parsed[3];
export const statefulSetWithHpaHpaDefinition = parsed[4];

export * from "./stateful_sets_info.ts";
