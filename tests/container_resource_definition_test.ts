import { assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { ContainerResourceDefinition } from "../src/k8s/container_resource_definition.ts";
import { UnitUtil } from "../src/util/unit_util.ts";

Deno.test("Should parse all fields", () => {
  const doc = {
    memory: "512Mi",
    cpu: "250m",
  };

  const resources = ContainerResourceDefinition.from(doc, 0);
  assertEquals(resources.cpuMillis, UnitUtil.parseCpuMillis(doc.cpu));
  assertEquals(resources.memoryBytes, UnitUtil.parseMemoryBytes(doc.memory));
});

Deno.test("Should parse cpu defined as number", () => {
  const doc = {
    memory: "512Mi",
    cpu: 250,
  };

  const resources = ContainerResourceDefinition.from(doc, 0);
  assertEquals(resources.cpuMillis, doc.cpu);
  assertEquals(resources.memoryBytes, UnitUtil.parseMemoryBytes(doc.memory));
});

Deno.test("Should parse requests", async ({ step }) => {
  await step("Should parse all fields when defined", () => {
    const doc = {
      memory: "512Mi",
      cpu: "250m",
    };

    const resources = ContainerResourceDefinition.from(doc, 0);
    assertEquals(resources.cpuMillis, UnitUtil.parseCpuMillis(doc.cpu));
    assertEquals(resources.memoryBytes, UnitUtil.parseMemoryBytes(doc.memory));
  });

  await step("Default value should be 0 when parsing from requests", () => {
    const doc = {};
    const defaultValue = 0;

    const resources = ContainerResourceDefinition.fromRequests(doc);
    assertEquals(resources.cpuMillis, defaultValue);
    assertEquals(resources.memoryBytes, defaultValue);
  });
});

Deno.test("Should parse limits", async ({ step }) => {
  await step("Should parse all fields when defined", () => {
    const doc = {
      memory: "512Mi",
      cpu: "250m",
    };

    const resources = ContainerResourceDefinition.from(doc, 0);
    assertEquals(resources.cpuMillis, UnitUtil.parseCpuMillis(doc.cpu));
    assertEquals(resources.memoryBytes, UnitUtil.parseMemoryBytes(doc.memory));
  });

  await step(
    "Default value should be undefined when parsing from limits",
    () => {
      const doc = {};
      const defaultValue = undefined;

      const resources = ContainerResourceDefinition.fromLimits(doc);
      assertEquals(resources.cpuMillis, defaultValue);
      assertEquals(resources.memoryBytes, defaultValue);
    },
  );
});

Deno.test("Add", async ({ step }) => {
  await step("Should do regular add operation of cpu and memory values", () => {
    const res1 = new ContainerResourceDefinition(100, 100);
    const res2 = new ContainerResourceDefinition(100, 100);
    const res = res1.add(res2);

    assertEquals(res.cpuMillis, 200);
    assertEquals(res.memoryBytes, 200);
  });

  await step("Number + undefined = undefined", () => {
    const res1 = new ContainerResourceDefinition(100, 100);
    const res2 = new ContainerResourceDefinition(undefined, undefined);
    const res = res1.add(res2);

    assertEquals(res.cpuMillis, undefined);
    assertEquals(res.memoryBytes, undefined);
  });

  await step("0 + undefined = undefined", () => {
    const res1 = new ContainerResourceDefinition(0, 0);
    const res2 = new ContainerResourceDefinition(undefined, undefined);
    const res = res1.add(res2);

    assertEquals(res.cpuMillis, undefined);
    assertEquals(res.memoryBytes, undefined);
  });

  await step("undefined + number = undefined", () => {
    const res1 = new ContainerResourceDefinition(undefined, undefined);
    const res2 = new ContainerResourceDefinition(100, 100);
    const res = res1.add(res2);

    assertEquals(res.cpuMillis, undefined);
    assertEquals(res.memoryBytes, undefined);
  });
});
