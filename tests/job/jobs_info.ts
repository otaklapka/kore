import { JobInfo, Kind } from "../../src/types.ts";
import { UnitUtil } from "../../src/util/unit_util.ts";

export const fullDefinedJobInfo: JobInfo = {
  name: "full-defined-job",
  kind: Kind.Job,
  containers: [
    {
      name: "my-container",
      requests: {
        cpuMillis: UnitUtil.parseCpuMillis("100m"),
        memoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
      },
      limits: {
        cpuMillis: UnitUtil.parseCpuMillis("200m"),
        memoryBytes: UnitUtil.parseMemoryBytes("512Mi"),
      },
    },
  ],
  resourcesSum: {
    requestsCpuMillis: UnitUtil.parseCpuMillis("100m"),
    requestsMemoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
    limitsCpuMillis: UnitUtil.parseCpuMillis("200m"),
    limitsMemoryBytes: UnitUtil.parseMemoryBytes("512Mi"),
  },
};

export const defaultContainerJobInfo: JobInfo = {
  name: "default-container-job",
  kind: Kind.Job,
  containers: [
    {
      name: "my-container",
      requests: {
        cpuMillis: 0,
        memoryBytes: 0,
      },
      limits: {
        cpuMillis: undefined,
        memoryBytes: undefined,
      },
    },
    {
      name: "my-second-container",
      requests: {
        cpuMillis: 0,
        memoryBytes: 0,
      },
      limits: {
        cpuMillis: undefined,
        memoryBytes: undefined,
      },
    },
  ],
  resourcesSum: {
    requestsCpuMillis: 0,
    requestsMemoryBytes: 0,
    limitsCpuMillis: undefined,
    limitsMemoryBytes: undefined,
  },
};

export const multipleContainerJobInfo: JobInfo = {
  name: "multiple-container-job",
  kind: Kind.Job,
  containers: [
    {
      name: "my-container",
      requests: {
        cpuMillis: UnitUtil.parseCpuMillis("100m"),
        memoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
      },
      limits: {
        cpuMillis: UnitUtil.parseCpuMillis("200m"),
        memoryBytes: UnitUtil.parseMemoryBytes("512Mi"),
      },
    },
    {
      name: "my-second-container",
      requests: {
        cpuMillis: UnitUtil.parseCpuMillis("250m"),
        memoryBytes: UnitUtil.parseMemoryBytes("128Mi"),
      },
      limits: {
        cpuMillis: UnitUtil.parseCpuMillis("500m"),
        memoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
      },
    },
    {
      name: "my-third-container",
      requests: {
        cpuMillis: UnitUtil.parseCpuMillis("500m"),
        memoryBytes: UnitUtil.parseMemoryBytes("128Mi"),
      },
      limits: {
        cpuMillis: UnitUtil.parseCpuMillis("1.25"),
        memoryBytes: UnitUtil.parseMemoryBytes("1Gi"),
      },
    },
  ],
  resourcesSum: {
    requestsCpuMillis: UnitUtil.sumCpu("100m", "250m", "500m"),
    requestsMemoryBytes: UnitUtil.sumMemory("256Mi", "128Mi", "128Mi"),
    limitsCpuMillis: UnitUtil.sumCpu("200m", "500m", "1.25"),
    limitsMemoryBytes: UnitUtil.sumMemory("512Mi", "256Mi", "1Gi"),
  },
};

export const mixedDefinedContainersJobInfo: JobInfo = {
  name: "mixed-defined-containers-job",
  kind: Kind.Job,
  containers: [
    {
      name: "my-container",
      requests: {
        cpuMillis: UnitUtil.parseCpuMillis("100m"),
        memoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
      },
      limits: {
        cpuMillis: UnitUtil.parseCpuMillis("200m"),
        memoryBytes: UnitUtil.parseMemoryBytes("512Mi"),
      },
    },
    {
      name: "my-second-container",
      requests: {
        cpuMillis: 0,
        memoryBytes: 0,
      },
      limits: {
        cpuMillis: undefined,
        memoryBytes: undefined,
      },
    },
  ],
  resourcesSum: {
    requestsCpuMillis: UnitUtil.parseCpuMillis("100m"),
    requestsMemoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
    limitsCpuMillis: undefined,
    limitsMemoryBytes: undefined,
  },
};

export const jobSpawnedByCronjobInfo: JobInfo = {
  ...fullDefinedJobInfo,
  name: "job-spawned-by-cronjob",
};
