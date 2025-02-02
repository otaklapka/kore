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

  static memoryBytesIntoHuman(memoryBytes: number): string {
    for (const [unit, bytes] of this.MEMORY_UNIT_TO_BYTES.entries()) {
      if (unit.length > 1 && memoryBytes >= bytes) {
        return `${memoryBytes / bytes}${unit}`;
      }
    }
    return memoryBytes.toString();
  }

  static cpuMilisToHuman(cpuMilis: number): string {
    if (cpuMilis >= 1) {
      return `${cpuMilis}`;
    }
    return `${cpuMilis * 1000}m`;
  }
}
