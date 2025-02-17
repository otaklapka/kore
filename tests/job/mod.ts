import { parseAll } from "@std/yaml";
import { assert } from "@std/assert";

const yaml = await Deno.readTextFile("./tests/job/jobs.yaml");
const parsed = parseAll(yaml) as unknown[];

assert(parsed.length === 5);

export const fullDefinedJobDefinition = parsed[0];
export const defaultContainerJobDefinition = parsed[1];
export const multipleContainerJobDefinition = parsed[2];
export const mixedDefinedContainerJobDefinition = parsed[3];
export const jobSpawnedByCronjobDefinition = parsed[4];

export * from "./jobs_info.ts";
