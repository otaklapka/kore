import { assert, assertEquals } from "@std/assert";
import { CronJob } from "../../src/k8s/cron_job.ts";
import { Metadata } from "../../src/k8s/metadata.ts";
import { Container } from "../../src/k8s/container.ts";
import {
  defaultContainerCronJobDefinition,
  defaultContainerCronJobInfo,
  fullDefinedCronJobDefinition,
  fullDefinedCronJobInfo,
  mixedDefinedContainerCronJobDefinition,
  mixedDefinedContainersCronJobInfo,
  multipleContainerCronJobDefinition,
  multipleContainerCronJobInfo,
} from "./mod.ts";

Deno.test("Cronjob", async ({ step }) => {
  await step("Should parse full definition", () => {
    const cronJob = CronJob.from(fullDefinedCronJobDefinition);
    assert(cronJob.metadata instanceof Metadata);
    assert(cronJob instanceof CronJob);
    assert(
      cronJob.containers.length === fullDefinedCronJobInfo.containers.length,
    );
    assert(
      cronJob.containers.every((container) => container instanceof Container),
    );
    assertEquals(cronJob.toJSON(), fullDefinedCronJobInfo);
  });

  await step(
    "Should parse with default container values",
    () => {
      const cronJob = CronJob.from(defaultContainerCronJobDefinition);
      assertEquals(cronJob.toJSON(), defaultContainerCronJobInfo);
    },
  );

  await step(
    "Should sum up multiple containers",
    () => {
      const cronJob = CronJob.from(multipleContainerCronJobDefinition);
      assertEquals(cronJob.toJSON(), multipleContainerCronJobInfo);
    },
  );

  await step(
    "Should sum up mixed defined containers",
    () => {
      const cronJob = CronJob.from(mixedDefinedContainerCronJobDefinition);
      assertEquals(cronJob.toJSON(), mixedDefinedContainersCronJobInfo);
    },
  );
});
