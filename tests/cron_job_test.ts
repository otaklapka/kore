import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { CronJob } from "../src/k8s/cron_job.ts";
import { Metadata } from "../src/k8s/metadata.ts";
import { Container } from "../src/k8s/container.ts";
import { ContainerInfo } from "../src/types.ts";
import cron = Deno.cron;
import { UnitUtil } from "../src/util/unit_util.ts";

Deno.test("Should parse cron job", async ({ step }) => {
  await step("Should parse full definition", () => {
    const doc = parse(`
        kind: CronJob
        metadata:
          name: my-cronjob
        spec:
          jobTemplate:
            spec:
              template:
                spec:
                  containers:
                    - name: my-container
                      resources:
                        requests:
                          memory: "256Mi"
                          cpu: "100m"
                        limits:
                          memory: "512Mi"
                          cpu: "200m"
    `);

    const cronJob = CronJob.from(doc);
    assert(cronJob.metadata instanceof Metadata);
    assert(cronJob instanceof CronJob);
    assert(cronJob.containers.length === 1);
    assert(cronJob.containers[0] instanceof Container);
    assertEquals(cronJob.toJSON(), {
      name: cronJob.metadata.name,
      kind: cronJob.kind,
      containers: cronJob.containers.map((container) => container.toJSON()),
      resourcesSum: {
        requestsCpuMillis: UnitUtil.parseCpuMillis("100m"),
        requestsMemoryBytes: UnitUtil.parseMemoryBytes("256Mi"),
        limitsCpuMillis: UnitUtil.parseCpuMillis("200m"),
        limitsMemoryBytes: UnitUtil.parseMemoryBytes("512Mi"),
      },
    });
  });

  await step(
    "Sum of requests and limits should have default value 0 and undefined when not specified on containers",
    () => {
      const doc = parse(`
        kind: CronJob
        metadata:
          name: my-cronjob
        spec:
          jobTemplate:
            spec:
              template:
                spec:
                  containers:
                    - name: my-container
    `);

      const cronJob = CronJob.from(doc);
      assertEquals(cronJob.toJSON(), {
        name: cronJob.metadata.name,
        kind: cronJob.kind,
        containers: cronJob.containers.map((container) => container.toJSON()),
        resourcesSum: {
          requestsCpuMillis: 0,
          requestsMemoryBytes: 0,
          limitsCpuMillis: undefined,
          limitsMemoryBytes: undefined,
        },
      });
    },
  );
});
