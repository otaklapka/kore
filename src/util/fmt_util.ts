import { UnitUtil } from "./unit_util.ts";

export class FmtUtil {
  static fmtMemoryBytes(
    bytes: number | undefined,
    placeholder: string = "",
  ): string {
    return typeof bytes === "number"
      ? UnitUtil.memoryBytesIntoHuman(bytes)
      : placeholder;
  }

  static fmtCpuMillis(
    millis: number | undefined,
    placeholder: string = "",
  ): string {
    return typeof millis === "number"
      ? UnitUtil.cpuMilisToHuman(millis)
      : placeholder;
  }

  static shortenName(name: string, length: number): string {
    if (name.length <= length) {
      return name;
    }
    const side = Math.trunc(length / 2);
    return `${name.slice(0, side)}...${name.slice(-side)}`;
  }
}
