import { parseAll } from "@std/yaml";
import { assert } from "@std/assert";

const yaml = await Deno.readTextFile("./tests/deployment/deployments.yaml");
const parsed = parseAll(yaml) as unknown[];

assert(parsed.length === 5);

export const fullDefinedDeploymentDefinition = parsed[0];
export const defaultContainersDeploymentDefinition = parsed[1];
export const mixedDefinedContainersDeploymentDefinition = parsed[2];
export const deploymentWithHpaDefinition = parsed[3];
export const deploymentWithHpaHpaDefinition = parsed[4];

export * from "./deployments_info.ts";
