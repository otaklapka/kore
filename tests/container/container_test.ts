import { CronJob } from "../../src/k8s/cron_job.ts";
import {
  fullDefinedCronJobDefinition,
  fullDefinedCronJobInfo,
} from "../cron_job/mod.ts";
import { Metadata } from "../../src/k8s/metadata.ts";
import { Container } from "../../src/k8s/container.ts";
import {
  defaultContainerDefinition,
  defaultContainerInfo,
  fullDefinedContainerDefinition,
  fullDefinedContainerInfo,
  limitsContainerDefinition,
  limitsContainerInfo,
  partialLimitsContainerDefinition,
  partialLimitsContainerInfo,
  partialRequestsContainerDefinition,
  partialRequestsContainerInfo,
  requestsContainerDefinition,
  requestsContainerInfo,
} from "./mod.ts";
import { assert, assertEquals } from "@std/assert";
import { ContainerResourceDefinition } from "../../src/k8s/container_resource_definition.ts";

Deno.test("Container", async ({ step }) => {
  await step("Should parse full definition", () => {
    const container = Container.from(fullDefinedContainerDefinition);
    assert(container instanceof Container);
    assert(container.requests instanceof ContainerResourceDefinition);
    assert(container.limits instanceof ContainerResourceDefinition);
    assertEquals(container.name, fullDefinedContainerInfo.name);
    assertEquals(container.toJSON(), fullDefinedContainerInfo);
  });

  await step("Should parse default", () => {
    const container = Container.from(defaultContainerDefinition);
    assertEquals(container.toJSON(), defaultContainerInfo);
  });

  await step("Should parse requests only", () => {
    const container = Container.from(requestsContainerDefinition);
    assertEquals(container.toJSON(), requestsContainerInfo);
  });

  await step("Should parse limits only", () => {
    const container = Container.from(limitsContainerDefinition);
    assertEquals(container.toJSON(), limitsContainerInfo);
  });

  await step("Should parse partial requests only", () => {
    const container = Container.from(partialRequestsContainerDefinition);
    assertEquals(container.toJSON(), partialRequestsContainerInfo);
  });

  await step("Should parse partial limits only", () => {
    const container = Container.from(partialLimitsContainerDefinition);
    assertEquals(container.toJSON(), partialLimitsContainerInfo);
  });
});
