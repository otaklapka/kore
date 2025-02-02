import { assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { ContainerResourceDefinition } from "../src/k8s/container_resource_definition.ts";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
        memory: "512Mi"
        cpu: "250m"
    `);

  const resources = ContainerResourceDefinition.from(yml);
  assertEquals(resources.cpuMillis, 0.25);
  assertEquals(resources.memoryBytes, 512 * 2 ^ 20);
});

Deno.test("cpu should be optional", () => {
  const yml = parse(`
        memory: "512ki"
    `);

  const resources = ContainerResourceDefinition.from(yml);
  assertEquals(resources.cpuMillis, undefined);
  assertEquals(resources.memoryBytes, 512 * 2 ^ 10);
});

Deno.test("memory should be optional", () => {
  const yml = parse(`
        cpu: 2
    `);

  const resources = ContainerResourceDefinition.from(yml);
  assertEquals(resources.cpuMillis, 2);
  assertEquals(resources.memoryBytes, undefined);
});

Deno.test("cpu could be specified as decimal value number", () => {
  const yml = parse(`
        cpu: 0.2
    `);

  const resources = ContainerResourceDefinition.from(yml);
  assertEquals(resources.cpuMillis, 0.2);
  assertEquals(resources.memoryBytes, undefined);
});

Deno.test("add - all defined", () => {
  const res1 = new ContainerResourceDefinition(100, 100);
  const res2 = new ContainerResourceDefinition(100, 100);
  const res = res1.add(res2);

  assertEquals(res.cpuMillis, 200);
  assertEquals(res.memoryBytes, 200);
});

Deno.test("add - first defined", () => {
  const res1 = new ContainerResourceDefinition(100, 100);
  const res2 = new ContainerResourceDefinition(undefined, undefined);
  const res = res1.add(res2);

  assertEquals(res.cpuMillis, 100);
  assertEquals(res.memoryBytes, 100);
});

Deno.test("add - second defined", () => {
  const res1 = new ContainerResourceDefinition(undefined, undefined);
  const res2 = new ContainerResourceDefinition(100, 100);
  const res = res1.add(res2);

  assertEquals(res.cpuMillis, 100);
  assertEquals(res.memoryBytes, 100);
});
