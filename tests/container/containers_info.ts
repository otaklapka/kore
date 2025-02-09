import { ContainerInfo } from "../../src/types.ts";
import { UnitUtil } from "../../src/util/unit_util.ts";

export const fullDefinedContainerInfo: ContainerInfo = {
  name: "full-defined-container",
  requests: {
    cpuMillis: UnitUtil.parseCpuMillis("100m"),
    memoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
  },
  limits: {
    cpuMillis: UnitUtil.parseCpuMillis("200m"),
    memoryBytes: UnitUtil.parseMemoryBytes("512Mi"),
  },
};

export const defaultContainerInfo: ContainerInfo = {
  name: "default-container",
  requests: {
    cpuMillis: 0,
    memoryBytes: 0,
  },
  limits: {
    cpuMillis: undefined,
    memoryBytes: undefined,
  },
};

export const requestsContainerInfo: ContainerInfo = {
  name: "requests-container",
  requests: {
    cpuMillis: UnitUtil.parseCpuMillis("100m"),
    memoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
  },
  limits: {
    cpuMillis: undefined,
    memoryBytes: undefined,
  },
};

export const limitsContainerInfo: ContainerInfo = {
  name: "limits-container",
  requests: {
    cpuMillis: 0,
    memoryBytes: 0,
  },
  limits: {
    cpuMillis: UnitUtil.parseCpuMillis("200m"),
    memoryBytes: UnitUtil.parseMemoryBytes("512Mi"),
  },
};

export const partialRequestsContainerInfo: ContainerInfo = {
  name: "partial-requests-container",
  requests: {
    cpuMillis: 0,
    memoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
  },
  limits: {
    cpuMillis: undefined,
    memoryBytes: undefined,
  },
};

export const partialLimitsContainerInfo: ContainerInfo = {
  name: "partial-limits-container",
  requests: {
    cpuMillis: 0,
    memoryBytes: 0,
  },
  limits: {
    cpuMillis: UnitUtil.parseCpuMillis("200m"),
    memoryBytes: undefined,
  },
};
