import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { CronJob } from "../src/k8s/cron_job.ts";
import { Metadata } from "../src/k8s/metadata.ts";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
        apiVersion: batch/v1
        kind: CronJob
        metadata:
          name: my-cronjob
          namespace: default
        spec:
          schedule: "0 0 * * *" # Runs at midnight every day
          jobTemplate:
            spec:
              template:
                metadata:
                  labels:
                    app: my-cronjob
                spec:
                  containers:
                    - name: my-container
                      image: my-container-image:latest
                      resources:
                        requests:
                          memory: "256Mi"
                          cpu: "100m"
                        limits:
                          memory: "512Mi"
                          cpu: "200m"
                      # Optionally, add commands or args here
                      # command: ["sh", "-c", "echo Hello World"]
                  restartPolicy: OnFailure
    `);

  const cronJob = CronJob.from(yml);
  assert(cronJob.metadata instanceof Metadata);
  assert(cronJob.containers.length === 1);
});
