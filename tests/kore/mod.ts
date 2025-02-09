import {
  defaultContainerCronJobDefinition,
  multipleContainerCronJobDefinition,
} from "../cron_job/mod.ts";
import {
  defaultContainerJobDefinition,
  multipleContainerJobDefinition,
} from "../job/mod.ts";
import {
  defaultContainersDeploymentDefinition,
  deploymentWithHpaDefinition,
  deploymentWithHpaHpaDefinition,
  fullDefinedDeploymentDefinition,
} from "../deployment/mod.ts";
import {
  defaultContainersStatefulSetDefinition,
  fullDefinedStatefulSetDefinition,
  statefulSetWithHpaDefinition,
  statefulSetWithHpaHpaDefinition,
} from "../stateful_set/mod.ts";
import { fullDefinedPvcDefinition } from "../pvc/mod.ts";

export const fullDefinedKoreDefinitions = [
  multipleContainerCronJobDefinition,
  multipleContainerJobDefinition,
  fullDefinedDeploymentDefinition,
  deploymentWithHpaDefinition,
  deploymentWithHpaHpaDefinition,
  fullDefinedStatefulSetDefinition,
  statefulSetWithHpaDefinition,
  statefulSetWithHpaHpaDefinition,
  fullDefinedPvcDefinition,
];

export const defaultKoreDefinitions = [
  defaultContainerCronJobDefinition,
  defaultContainerJobDefinition,
  defaultContainersDeploymentDefinition,
  defaultContainersStatefulSetDefinition,
];

export * from "./kore_info.ts";
