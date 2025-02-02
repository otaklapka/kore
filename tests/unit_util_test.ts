import { assertEquals } from "@std/assert";
import { UnitUtil } from "../src/util/unit_util.ts";

Deno.test("cpu m", () => {
  assertEquals(UnitUtil.parseCpuMillis("200m"), 0.2);
});

Deno.test("cpu plain", () => {
  assertEquals(UnitUtil.parseCpuMillis("5"), 5);
});

Deno.test("memory k", () => {
  assertEquals(UnitUtil.parseMemoryBytes("100k"), 100 * 1e3);
});

Deno.test("memory ki", () => {
  assertEquals(UnitUtil.parseMemoryBytes("100ki"), 100 * 2 ^ 10);
});

Deno.test("memory M", () => {
  assertEquals(UnitUtil.parseMemoryBytes("100M"), 100 * 1e6);
});

Deno.test("memory Mi", () => {
  assertEquals(UnitUtil.parseMemoryBytes("100Mi"), 100 * 2 ^ 20);
});

Deno.test("memory G", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3G"), 3 * 1e9);
});

Deno.test("memory Gi", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3Gi"), 3 * 2 ^ 30);
});

Deno.test("memory T", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3T"), 3 * 1e12);
});

Deno.test("memory Ti", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3Ti"), 3 * 2 ^ 40);
});

Deno.test("memory P", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3P"), 3 * 1e15);
});

Deno.test("memory Pi", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3Pi"), 3 * 2 ^ 50);
});

Deno.test("memory E", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3E"), 3 * 1e18);
});

Deno.test("memory Ei", () => {
  assertEquals(UnitUtil.parseMemoryBytes("3Ei"), 3 * 2 ^ 60);
});
