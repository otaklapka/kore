import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Container } from "../src/k8s/container.ts";
import { ContainerResourceDefinition } from "../src/k8s/container_resource_definition.ts";
import { FmtUtil } from "../src/util/fmt_util.ts";
import { UnitUtil } from "../src/util/unit_util.ts";

Deno.test("Should parse container", async ({ step }) => {
  await step("Should parse full definition", () => {
    const doc = parse(`
        name: my-container
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
    `);

    const container = Container.from(doc);
    assertEquals(container.name, "my-container");
    assert(container.requests instanceof ContainerResourceDefinition);
    assert(container.limits instanceof ContainerResourceDefinition);
  });

  await step("Should parse container with default values", () => {
    const doc = parse(`
        name: my-container
    `);

    const container = Container.from(doc);
    assertEquals(container.name, "my-container");
    assert(container.requests instanceof ContainerResourceDefinition);
    assert(container.limits instanceof ContainerResourceDefinition);
    assertEquals(container.limits.memoryBytes, undefined);
    assertEquals(container.limits.cpuMillis, undefined);
    assertEquals(container.requests.memoryBytes, 0);
    assertEquals(container.requests.cpuMillis, 0);
  });

  await step("Should parse container with default limits", () => {
    const doc = parse(`
        name: my-container
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
    `);

    const container = Container.from(doc);
    assertEquals(container.name, "my-container");
    assert(container.requests instanceof ContainerResourceDefinition);
    assert(container.limits instanceof ContainerResourceDefinition);
    assertEquals(container.limits.memoryBytes, undefined);
    assertEquals(container.limits.cpuMillis, undefined);
    assertEquals(
      container.requests.memoryBytes,
      UnitUtil.parseMemoryBytes("512Mi"),
    );
    assertEquals(container.requests.cpuMillis, UnitUtil.parseCpuMillis("250m"));
  });

  await step("Should parse container with default requests", () => {
    const doc = parse(`
        name: my-container
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
    `);

    const container = Container.from(doc);
    assertEquals(container.name, "my-container");
    assert(container.requests instanceof ContainerResourceDefinition);
    assert(container.limits instanceof ContainerResourceDefinition);
    assertEquals(container.requests.memoryBytes, 0);
    assertEquals(container.requests.cpuMillis, 0);
    assertEquals(
      container.limits.memoryBytes,
      UnitUtil.parseMemoryBytes("1Gi"),
    );
    assertEquals(container.limits.cpuMillis, UnitUtil.parseCpuMillis("500m"));
  });
});
