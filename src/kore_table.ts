import {
  ContainerInfo,
  DeploymentInfo, JobInfo,
  Kind,
  KoreInfo,
  PvcInfo,
  StatefulSetInfo,
} from "./types.ts";
import { FmtUtil } from "./util/fmt_util.ts";
import { Cell, RowType, Table } from "@cliffy/table";
import { bold, dim } from "@std/fmt/colors";
export class KoreTable {
  constructor(private readonly info: KoreInfo) {}

  public printTable(): void {
    const table = new Table()
      .header([
        "Name",
        "Kind",
        "Pods",
        "request.cpu",
        "request.memory",
        "limits.cpu",
        "limits.memory",
        "requests.storage",
      ]);

    for (const objInfo of this.info.objects) {
      switch (objInfo.kind) {
        case Kind.Deployment:
          table.push(
            ...this.deploymentInfoIntoTableRow(objInfo as DeploymentInfo),
          );
          break;
        case Kind.StatefulSet:
          table.push(
            ...this.statefulSetInfoIntoTableRow(objInfo as StatefulSetInfo),
          );
          break;
        case Kind.CronJob:
        case Kind.Job:
          table.push(...this.jobInfoIntoTableRow(objInfo as JobInfo));
          break;
        case Kind.PersistentVolumeClaim:
          table.push(this.pvcInfoIntoTableRow(objInfo as PvcInfo));
          break;
        default:
          break;
      }
    }

    table.push([
      "Total",
      "",
      "",
      FmtUtil.fmtCpuMillis(this.info.resourcesSum.requestsCpuMillis),
      FmtUtil.fmtMemoryBytes(this.info.resourcesSum.requestsMemoryBytes),
      FmtUtil.fmtCpuMillis(this.info.resourcesSum.limitsCpuMillis),
      FmtUtil.fmtMemoryBytes(this.info.resourcesSum.limitsMemoryBytes),
      FmtUtil.fmtMemoryBytes(this.info.resourcesSum.requestsStorageBytes),
    ].map((val) => bold(val)));

    table.render();
  }

  private deploymentInfoIntoTableRow(obj: DeploymentInfo): RowType[] {
    return [
      [
        obj.name,
        obj.kind,
        obj.minReplicas !== obj.maxReplicas
          ? `${obj.minReplicas}→${obj.maxReplicas}`
          : obj.maxReplicas,
        FmtUtil.fmtCpuMillis(obj.resourcesSum.requestsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.requestsMemoryBytes),
        FmtUtil.fmtCpuMillis(obj.resourcesSum.limitsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.limitsMemoryBytes),
        "",
      ],
      ...obj.containers.map((container) =>
        this.containerInfoIntoTableRow(container)
      ),
    ];
  }

  private jobInfoIntoTableRow(obj: JobInfo): RowType[] {
    return [
      [
        obj.name,
        obj.kind,
        1,
        FmtUtil.fmtCpuMillis(obj.resourcesSum.requestsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.requestsMemoryBytes),
        FmtUtil.fmtCpuMillis(obj.resourcesSum.limitsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.limitsMemoryBytes),
        "",
      ],
      ...obj.containers.map((container) =>
        this.containerInfoIntoTableRow(container)
      ),
    ];
  }

  private statefulSetInfoIntoTableRow(obj: StatefulSetInfo): RowType[] {
    return [
      [
        obj.name,
        obj.kind,
        obj.replicas,
        FmtUtil.fmtCpuMillis(obj.resourcesSum.requestsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.requestsMemoryBytes),
        FmtUtil.fmtCpuMillis(obj.resourcesSum.limitsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.limitsMemoryBytes),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.requestsStorageBytes),
      ],
      ...obj.containers.map((container) =>
        this.containerInfoIntoTableRow(container)
      ),
      ...obj.pvcs.map((pvc) => this.pvcInfoIntoTableRow(pvc, true)),
    ];
  }

  private containerInfoIntoTableRow(obj: ContainerInfo): RowType {
    return [
      `  ${obj.name}`,
      "Container",
      "",
      FmtUtil.fmtCpuMillis(obj.requests.cpuMillis),
      FmtUtil.fmtMemoryBytes(obj.requests.memoryBytes),
      FmtUtil.fmtCpuMillis(obj.limits.cpuMillis),
      FmtUtil.fmtMemoryBytes(obj.limits.memoryBytes),
      "",
    ].map((val) => dim(val));
  }

  private pvcInfoIntoTableRow(obj: PvcInfo, nested: boolean = false): RowType {
    const storageBytesFmtdVal = FmtUtil.fmtMemoryBytes(
      obj.resourcesSum.requestsStorageBytes,
    );
    return [
      obj.name,
      obj.kind,
      "",
      "",
      "",
      "",
      "",
      storageBytesFmtdVal,
    ].map((val) => nested ? dim(val) : val);
  }
}
