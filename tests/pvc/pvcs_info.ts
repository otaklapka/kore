import { Kind, PvcInfo } from "../../src/types.ts";
import { UnitUtil } from "../../src/util/unit_util.ts";

export const fullDefinedPvcInfo: PvcInfo = {
  name: "my-pvc",
  kind: Kind.PersistentVolumeClaim,
  resourcesSum: {
    requestsStorageBytes: UnitUtil.parseMemoryBytes("5Gi"),
  },
};

export const fullDefinedStsMyPvcInfo: PvcInfo = {
  name: "full-defined-statefulset-my-pvc",
  kind: Kind.PersistentVolumeClaim,
  resourcesSum: {
    requestsStorageBytes: UnitUtil.parseMemoryBytes("5Gi"),
  },
};

export const fullDefinedStsMySecondInfo: PvcInfo = {
  name: "full-defined-statefulset-my-second-pvc",
  kind: Kind.PersistentVolumeClaim,
  resourcesSum: {
    requestsStorageBytes: UnitUtil.parseMemoryBytes("50Mi"),
  },
};

export const pvcNotMatchingAnyStsInfo: PvcInfo = {
  name: "pvc-not-matching-sts",
  kind: Kind.PersistentVolumeClaim,
  resourcesSum: {
    requestsStorageBytes: UnitUtil.parseMemoryBytes("100Mi"),
  },
};
