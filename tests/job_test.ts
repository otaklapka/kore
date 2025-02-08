import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import { Container } from "../src/k8s/container.ts";
import { UnitUtil } from "../src/util/unit_util.ts";
import { Job } from "../src/k8s/job.ts";

Deno.test("Should parse job", async ({ step }) => {
  await step("Should parse full definition", () => {
    const doc = parse(`
        kind: Job
        metadata:
          name: calculation-job
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

    const job = Job.from(doc);
    assert(job.metadata instanceof Metadata);
    assert(job instanceof Job);
    assert(job.containers.length === 1);
    assert(job.containers[0] instanceof Container);
    assertEquals(job.toJSON(), {
      name: job.metadata.name,
      kind: job.kind,
      containers: job.containers.map((container) => container.toJSON()),
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
        kind: Job
        metadata:
          name: calculation-job
        spec:
          template:
            spec:
              containers:
                - name: my-container
    `);

      const job = Job.from(doc);
      assertEquals(job.toJSON(), {
        name: job.metadata.name,
        kind: job.kind,
        containers: job.containers.map((container) => container.toJSON()),
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
