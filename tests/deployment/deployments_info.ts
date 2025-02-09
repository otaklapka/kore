import { DeploymentInfo, Kind } from "../../src/types.ts";
import { UnitUtil } from "../../src/util/unit_util.ts";

export const fullDefinedDeploymentInfo: DeploymentInfo = {
  name: "full-defined-deployment",
  kind: Kind.Deployment,
  minReplicas: 1,
  maxReplicas: 3,
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
    requestsCpuMillis: UnitUtil.sumCpu("100m", "250m", "500m") * 3,
    requestsMemoryBytes: UnitUtil.sumMemory("256Mi", "128Mi", "128Mi") * 3,
    limitsCpuMillis: UnitUtil.sumCpu("200m", "500m", "1.25") * 3,
    limitsMemoryBytes: UnitUtil.sumMemory("512Mi", "256Mi", "1Gi") * 3,
  },
};

export const defaultContainersDeploymentInfo: DeploymentInfo = {
  name: "default-containers-deployment",
  kind: Kind.Deployment,
  minReplicas: 1,
  maxReplicas: 3,
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

export const mixedDefinedContainersDeploymentInfo: DeploymentInfo = {
  name: "mixed-defined-containers-deployment",
  kind: Kind.Deployment,
  minReplicas: 1,
  maxReplicas: 3,
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
    requestsCpuMillis: UnitUtil.parseCpuMillis("100m") * 3,
    requestsMemoryBytes: UnitUtil.parseMemoryBytes("256Mi") * 3,
    limitsCpuMillis: undefined,
    limitsMemoryBytes: undefined,
  },
};

export const deploymentWithHpaInfo: DeploymentInfo = {
  name: "deployment-with-hpa",
  kind: Kind.Deployment,
  minReplicas: 1,
  maxReplicas: 5,
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
    requestsCpuMillis: UnitUtil.parseCpuMillis("100m") * 5,
    requestsMemoryBytes: UnitUtil.parseMemoryBytes("256Mi") * 5,
    limitsCpuMillis: UnitUtil.parseCpuMillis("200m") * 5,
    limitsMemoryBytes: UnitUtil.parseMemoryBytes("512Mi") * 5,
  },
};
