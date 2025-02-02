import { UnitUtil } from "./unit_util.ts";

export class FmtUtil {
  static fmtMemoryBytes(bytes: number | undefined): string {
    return bytes ? UnitUtil.memoryBytesIntoHuman(bytes) : "-";
  }

  static fmtCpuMillis(millis: number | undefined): string {
    return millis ? UnitUtil.cpuMilisToHuman(millis) : "-";
  }
}
