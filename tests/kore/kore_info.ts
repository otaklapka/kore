import { KoreInfo } from "../../src/types.ts";
import {
  defaultContainerCronJobInfo,
  multipleContainerCronJobInfo,
} from "../cron_job/mod.ts";
import {
  defaultContainerJobInfo,
  jobSpawnedByCronjobInfo,
  multipleContainerJobInfo,
} from "../job/mod.ts";
import {
  defaultContainersDeploymentInfo,
  deploymentWithHpaInfo,
  fullDefinedDeploymentInfo,
} from "../deployment/mod.ts";
import {
  defaultContainersStatefulSetInfo,
  fullDefinedStatefulSetInfo,
  statefulSetWithHpaInfo,
} from "../stateful_set/mod.ts";
import { pvcNotMatchingAnyStsInfo } from "../pvc/pvcs_info.ts";

const definedObjectsWithMemoryAndCpu = [
  multipleContainerCronJobInfo,
  multipleContainerJobInfo,
  fullDefinedDeploymentInfo,
  deploymentWithHpaInfo,
  fullDefinedStatefulSetInfo,
  statefulSetWithHpaInfo,
];

export const fullDefinedKoreInfo: KoreInfo = {
  objects: [...definedObjectsWithMemoryAndCpu, pvcNotMatchingAnyStsInfo],
  resourcesSum: {
    requestsCpuMillis: definedObjectsWithMemoryAndCpu.reduce(
      (acc, it) => it.resourcesSum.requestsCpuMillis + acc,
      0,
    ),
    requestsMemoryBytes: definedObjectsWithMemoryAndCpu.reduce(
      (acc, it) => it.resourcesSum.requestsMemoryBytes + acc,
      0,
    ),
    requestsStorageBytes: [
      fullDefinedStatefulSetInfo,
      statefulSetWithHpaInfo,
      pvcNotMatchingAnyStsInfo,
    ].reduce((acc, it) => it.resourcesSum.requestsStorageBytes + acc, 0),
    limitsCpuMillis: definedObjectsWithMemoryAndCpu.reduce(
      (acc, it) => it.resourcesSum.limitsCpuMillis! + acc,
      0,
    ),
    limitsMemoryBytes: definedObjectsWithMemoryAndCpu.reduce(
      (acc, it) => it.resourcesSum.limitsMemoryBytes! + acc,
      0,
    ),
  },
};

export const defaultDefinedKoreInfo: KoreInfo = {
  objects: [
    defaultContainerCronJobInfo,
    defaultContainerJobInfo,
    defaultContainersDeploymentInfo,
    defaultContainersStatefulSetInfo,
  ],
  resourcesSum: {
    requestsCpuMillis: 0,
    requestsMemoryBytes: 0,
    requestsStorageBytes: 0,
    limitsCpuMillis: undefined,
    limitsMemoryBytes: undefined,
  },
};
