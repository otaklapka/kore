import { assert, assertEquals } from "@std/assert";
import { Metadata } from "../../src/k8s/metadata.ts";
import { Container } from "../../src/k8s/container.ts";
import {
  defaultContainerJobDefinition,
  defaultContainerJobInfo,
  fullDefinedJobDefinition,
  fullDefinedJobInfo,
  jobSpawnedByCronjobDefinition,
  jobSpawnedByCronjobInfo,
  mixedDefinedContainerJobDefinition,
  mixedDefinedContainersJobInfo,
  multipleContainerJobDefinition,
  multipleContainerJobInfo,
} from "./mod.ts";
import { Job } from "../../src/k8s/job.ts";

Deno.test("Job", async ({ step }) => {
  await step("Should parse full definition", () => {
    const cronJob = Job.from(fullDefinedJobDefinition);
    assert(cronJob.metadata instanceof Metadata);
    assert(cronJob instanceof Job);
    assert(
      cronJob.containers.length === fullDefinedJobInfo.containers.length,
    );
    assert(
      cronJob.containers.every((container) => container instanceof Container),
    );
    assertEquals(cronJob.toJSON(), fullDefinedJobInfo);
    assertEquals(cronJob.isSpawnedByCronJob(), false);
  });

  await step(
    "Should parse with default container values",
    () => {
      const cronJob = Job.from(defaultContainerJobDefinition);
      assertEquals(cronJob.toJSON(), defaultContainerJobInfo);
      assertEquals(cronJob.isSpawnedByCronJob(), false);
    },
  );

  await step(
    "Should sum up multiple containers",
    () => {
      const cronJob = Job.from(multipleContainerJobDefinition);
      assertEquals(cronJob.toJSON(), multipleContainerJobInfo);
      assertEquals(cronJob.isSpawnedByCronJob(), false);
    },
  );

  await step(
    "Should sum up mixed defined containers",
    () => {
      const cronJob = Job.from(mixedDefinedContainerJobDefinition);
      assertEquals(cronJob.toJSON(), mixedDefinedContainersJobInfo);
      assertEquals(cronJob.isSpawnedByCronJob(), false);
    },
  );

  await step(
    "Should parse recognize jobs spawned by cronjob",
    () => {
      const cronJob = Job.from(jobSpawnedByCronjobDefinition);
      assertEquals(cronJob.toJSON(), jobSpawnedByCronjobInfo);
      assertEquals(cronJob.isSpawnedByCronJob(), true);
    },
  );
});
