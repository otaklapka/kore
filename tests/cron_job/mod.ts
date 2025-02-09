import { parseAll } from "@std/yaml";
import { assert } from "@std/assert";

const yaml = await Deno.readTextFile("./tests/cron_job/cron_jobs.yaml");
const parsed = parseAll(yaml) as unknown[];

assert(parsed.length === 4);

export const fullDefinedCronJobDefinition = parsed[0];
export const defaultContainerCronJobDefinition = parsed[1];
export const multipleContainerCronJobDefinition = parsed[2];
export const mixedDefinedContainerCronJobDefinition = parsed[3];

export * from "./cron_jobs_info.ts";
