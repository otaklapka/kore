import { parseAll } from "@std/yaml";
import { assert } from "@std/assert";

const yaml = await Deno.readTextFile("./tests/container/containers.yaml");
const parsed = parseAll(yaml) as unknown[];

assert(parsed.length === 6);

export const fullDefinedContainerDefinition = parsed[0];
export const defaultContainerDefinition = parsed[1];
export const requestsContainerDefinition = parsed[2];
export const limitsContainerDefinition = parsed[3];
export const partialRequestsContainerDefinition = parsed[4];
export const partialLimitsContainerDefinition = parsed[5];

export * from "./containers_info.ts";
