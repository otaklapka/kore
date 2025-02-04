import { sprintf } from "@std/fmt/printf";
export class UnitUtil {
  private static MEMORY_UNIT_TO_BYTES: Map<string, number> = new Map([
    ["Ei", 2 ** 60],
    ["E", 1e18],
    ["Pi", 2 ** 50],
    ["P", 1e15],
    ["Ti", 2 ** 40],
    ["T", 1e12],
    ["Gi", 2 ** 30],
    ["G", 1e9],
    ["Mi", 2 ** 20],
    ["M", 1e6],
    ["ki", 2 ** 10],
    ["k", 1e3],
  ]);

  public static parseCpuMillis(input: string): number {
    const re = /^(\d+\.?\d*)(m?)$/m;
    const match = re.exec(input);
    const value = Number(match?.[1]);

    if (match && !Number.isNaN(value)) {
      switch (match[2]) {
        case "m":
          return value * 0.001;
        case "":
          return value;
        default:
          break;
      }
    }

    throw new Error("Invalid cpu value");
  }

  public static parseMemoryBytes(input: string): number {
    const re = /^(\d+)([EPTGMk]i?)$/m;
    const match = re.exec(input);
    const value = Number(match?.[1]);
    const unit = match?.[2];

    if (
      match && !Number.isNaN(value) && unit &&
      this.MEMORY_UNIT_TO_BYTES.has(unit)
    ) {
      return value * this.MEMORY_UNIT_TO_BYTES.get(unit)!;
    }

    throw new Error("Invalid memory value");
  }

  public static sumMemory(...args: string[]): number {
    return args.reduce((acc, val) => this.parseMemoryBytes(val) + acc, 0);
  }

  public static sumCpu(...args: string[]): number {
    return args.reduce((acc, val) => this.parseCpuMillis(val) + acc, 0);
  }

  static memoryBytesIntoHuman(memoryBytes: number): string {
    for (const [unit, bytes] of this.MEMORY_UNIT_TO_BYTES.entries()) {
      if (unit.length > 1 && memoryBytes >= bytes) {
        return `${this.fmtNumber(memoryBytes / bytes)}${unit}`;
      }
    }
    return this.fmtNumber(memoryBytes);
  }

  static cpuMilisToHuman(cpuMilis: number): string {
    if (cpuMilis >= 1) {
      return `${this.fmtNumber(cpuMilis)}`;
    }
    return `${this.fmtNumber(cpuMilis * 1000)}m`;
  }

  static fmtNumber(number: number): string {
    switch (number.toString().split(".")[1]?.length) {
      case undefined:
        return number.toString();
      case 1:
        return sprintf("%.1f", number);
      default:
        return sprintf("%.2f", number);
    }
  }
}
