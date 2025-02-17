import {
  ContainerInfo,
  DeploymentInfo,
  JobInfo,
  Kind,
  KoreInfo,
  KoreOptions,
  PvcInfo,
  StatefulSetInfo,
} from "./types.ts";
import { FmtUtil } from "./util/fmt_util.ts";
import { RowType, Table } from "@cliffy/table";
import { bold, dim } from "@std/fmt/colors";
export class KoreTable {
  constructor(
    private readonly info: KoreInfo,
    private readonly options: Pick<KoreOptions, "abbreviateNames">,
  ) {}

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
      ].map((header) => bold(header)));

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
      FmtUtil.fmtCpuMillis(this.info.resourcesSum.limitsCpuMillis, "unlimited"),
      FmtUtil.fmtMemoryBytes(
        this.info.resourcesSum.limitsMemoryBytes,
        "unlimited",
      ),
      FmtUtil.fmtMemoryBytes(this.info.resourcesSum.requestsStorageBytes),
    ].map((val) => bold(val)));

    table.render();
  }

  private deploymentInfoIntoTableRow(obj: DeploymentInfo): RowType[] {
    return [
      [
        this.formatObjectNameByOptions(obj.name),
        obj.kind,
        obj.minReplicas !== obj.maxReplicas
          ? `${obj.minReplicas}→${obj.maxReplicas}`
          : obj.maxReplicas,
        FmtUtil.fmtCpuMillis(obj.resourcesSum.requestsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.requestsMemoryBytes),
        FmtUtil.fmtCpuMillis(obj.resourcesSum.limitsCpuMillis, "unlimited"),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.limitsMemoryBytes, "unlimited"),
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
        this.formatObjectNameByOptions(obj.name),
        obj.kind,
        1,
        FmtUtil.fmtCpuMillis(obj.resourcesSum.requestsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.requestsMemoryBytes),
        FmtUtil.fmtCpuMillis(obj.resourcesSum.limitsCpuMillis, "unlimited"),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.limitsMemoryBytes, "unlimited"),
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
        this.formatObjectNameByOptions(obj.name),
        obj.kind,
        obj.minReplicas !== obj.maxReplicas
          ? `${obj.minReplicas}→${obj.maxReplicas}`
          : obj.maxReplicas,
        FmtUtil.fmtCpuMillis(obj.resourcesSum.requestsCpuMillis),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.requestsMemoryBytes),
        FmtUtil.fmtCpuMillis(obj.resourcesSum.limitsCpuMillis, "unlimited"),
        FmtUtil.fmtMemoryBytes(obj.resourcesSum.limitsMemoryBytes, "unlimited"),
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
      `  ${this.formatObjectNameByOptions(obj.name)}`,
      "Container",
      "",
      FmtUtil.fmtCpuMillis(obj.requests.cpuMillis),
      FmtUtil.fmtMemoryBytes(obj.requests.memoryBytes),
      FmtUtil.fmtCpuMillis(obj.limits.cpuMillis, "unlimited"),
      FmtUtil.fmtMemoryBytes(obj.limits.memoryBytes, "unlimited"),
      "",
    ].map((val) => dim(val));
  }

  private pvcInfoIntoTableRow(obj: PvcInfo, nested: boolean = false): RowType {
    const storageBytesFmtdVal = FmtUtil.fmtMemoryBytes(
      obj.resourcesSum.requestsStorageBytes,
    );
    return [
      nested
        ? `  ${this.formatObjectNameByOptions(obj.name)}`
        : this.formatObjectNameByOptions(obj.name),
      obj.kind,
      "",
      "",
      "",
      "",
      "",
      storageBytesFmtdVal,
    ].map((val) => nested ? dim(val) : val);
  }

  private formatObjectNameByOptions(name: string): string {
    return this.options?.abbreviateNames && this.options?.abbreviateNames > 0
      ? FmtUtil.shortenName(name, this.options.abbreviateNames)
      : name;
  }
}
