import { Kind, PvcInfo } from "../../src/types.ts";
import { UnitUtil } from "../../src/util/unit_util.ts";

export const fullDefinedPvcInfo: PvcInfo = {
  name: "my-pvc",
  kind: Kind.PersistentVolumeClaim,
  resourcesSum: {
    requestsStorageBytes: UnitUtil.parseMemoryBytes("5Gi"),
  },
};
