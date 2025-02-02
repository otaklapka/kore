import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Container } from "../src/k8s/container.ts";
import { ContainerResourceDefinition } from "../src/k8s/container_resource_definition.ts";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
        name: my-container
        image: my-container-image:latest
        ports:
          - containerPort: 8080
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
    `);

  const container = Container.from(yml);
  assertEquals(container.name, "my-container");
  assert(container.requests instanceof ContainerResourceDefinition);
  assert(container.limits instanceof ContainerResourceDefinition);
});

Deno.test("Llimits should be optional", () => {
  const yml = parse(`
        name: my-container
        image: my-container-image:latest
        ports:
          - containerPort: 8080
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
    `);

  const container = Container.from(yml);
  assertEquals(container.name, "my-container");
  assert(container.requests instanceof ContainerResourceDefinition);
  assertEquals(container.limits, undefined);
});

Deno.test("Requests should be optional", () => {
  const yml = parse(`
        name: my-container
        image: my-container-image:latest
        ports:
          - containerPort: 8080
        resources:
          limits:
            memory: "512Mi"
            cpu: "250m"
    `);

  const container = Container.from(yml);
  assertEquals(container.name, "my-container");
  assert(container.limits instanceof ContainerResourceDefinition);
  assertEquals(container.requests, undefined);
});

Deno.test("Requests should be optional", () => {
  const yml = parse(`
        name: my-container
        image: my-container-image:latest
        ports:
          - containerPort: 8080
    `);

  const container = Container.from(yml);
  assertEquals(container.name, "my-container");
  assertEquals(container.limits, undefined);
  assertEquals(container.requests, undefined);
});

Deno.test("Requests should be optional (with empty object)", () => {
  const yml = parse(`
        name: my-container
        image: my-container-image:latest
        ports:
          - containerPort: 8080
        resources: {}
    `);

  const container = Container.from(yml);
  assertEquals(container.name, "my-container");
  assertEquals(container.limits, undefined);
  assertEquals(container.requests, undefined);
});
