import { Deployment } from "./k8s/deployment.ts";
import { StatefulSet } from "./k8s/stateful_set.ts";
import { CronJob } from "./k8s/cron_job.ts";
import { Pvc } from "./k8s/pvc.ts";
import { Metadata } from "./k8s/metadata.ts";
import { Hpa } from "./k8s/hpa.ts";

export type Options = {
  verbose?: boolean | undefined;
};

export type KubeObject = Deployment | StatefulSet | CronJob | Pvc | Hpa;

export interface RefTarget {
  kind: string;
  metadata: Metadata;
}

export interface ContainerResourceDefinitionInfo {
  cpuMillis?: number;
  memoryBytes?: number;
}

export interface PvcResourcesDefinitionInfo {
  storageBytes: number;
}

export interface ContainerInfo {
  name: string;
  requests: ContainerResourceDefinitionInfo;
  limits: ContainerResourceDefinitionInfo;
}

export interface PvcInfo {
  name: string;
  kind: Kind.PersistentVolumeClaim;
  resourcesSum: {
    requestsStorageBytes: number;
  };
}

export interface DeploymentInfo {
  name: string;
  kind: Kind.Deployment;
  containers: ContainerInfo[];
  minReplicas: number;
  maxReplicas: number;
  resourcesSum: {
    requestsCpuMillis: number;
    requestsMemoryBytes: number;
    limitsCpuMillis?: number | undefined;
    limitsMemoryBytes?: number | undefined;
  };
}

export interface StatefulSetInfo {
  name: string;
  kind: string;
  containers: ContainerInfo[];
  pvcs: PvcInfo[];
  replicas: number;
  resourcesSum: {
    requestsCpuMillis: number;
    requestsMemoryBytes: number;
    limitsCpuMillis?: number;
    limitsMemoryBytes?: number;
    requestsStorageBytes: number;
  };
}

export interface CronJobInfo {
  name: string;
  kind: string;
  containers: ContainerInfo[];
  resourcesSum: {
    requestsCpuMillis: number;
    requestsMemoryBytes: number;
    limitsCpuMillis?: number;
    limitsMemoryBytes?: number;
  };
}

export enum Kind {
  Deployment = "Deployment",
  StatefulSet = "StatefulSet",
  PersistentVolumeClaim = "PersistentVolumeClaim",
  HorizontalPodAutoscaler = "HorizontalPodAutoscaler",
  CronJob = "CronJob",
}

export type InfoObject =
  | DeploymentInfo
  | StatefulSetInfo
  | CronJobInfo
  | PvcInfo;

export interface KoreInfo {
  objects: InfoObject[];
  resourcesSum: {
    requestsCpuMillis: number;
    requestsMemoryBytes: number;
    limitsCpuMillis?: number;
    limitsMemoryBytes?: number;
    requestsStorageBytes: number;
  };
}
