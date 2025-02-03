import { assertEquals } from "@std/assert";
import { UnitUtil } from "../src/util/unit_util.ts";

Deno.test("Should parse memory units", async ({ step }) => {
  await step("memory k", () => {
    assertEquals(UnitUtil.parseMemoryBytes("100k"), 100 * 1e3);
  });

  await step("memory ki", () => {
    assertEquals(UnitUtil.parseMemoryBytes("100ki"), 100 * 2 ** 10);
  });

  await step("memory M", () => {
    assertEquals(UnitUtil.parseMemoryBytes("100M"), 100 * 1e6);
  });

  await step("memory Mi", () => {
    assertEquals(UnitUtil.parseMemoryBytes("100Mi"), 100 * 2 ** 20);
  });

  await step("memory G", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3G"), 3 * 1e9);
  });

  await step("memory Gi", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3Gi"), 3 * 2 ** 30);
  });

  await step("memory T", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3T"), 3 * 1e12);
  });

  await step("memory Ti", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3Ti"), 3 * 2 ** 40);
  });

  await step("memory P", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3P"), 3 * 1e15);
  });

  await step("memory Pi", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3Pi"), 3 * 2 ** 50);
  });

  await step("memory E", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3E"), 3 * 1e18);
  });

  await step("memory Ei", () => {
    assertEquals(UnitUtil.parseMemoryBytes("3Ei"), 3 * 2 ** 60);
  });
});

Deno.test("Should parse cpu units", async ({ step }) => {
  await step("cpu m", () => {
    assertEquals(UnitUtil.parseCpuMillis("200m"), 0.2);
  });

  await step("cpu plain", () => {
    assertEquals(UnitUtil.parseCpuMillis("5"), 5);
  });
});

