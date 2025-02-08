import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { StatefulSet } from "../src/k8s/stateful_set.ts";
import { Metadata } from "../src/k8s/metadata.ts";
import { Kind } from "../src/types.ts";

Deno.test("Should parse stateful set", async ({ step }) => {
  await step("Should parse all fields when defined", () => {
    const doc = parse(`
        kind: StatefulSet
        metadata:
          name: my-statefulset
        spec:
          replicas: 3
          template:
            spec:
              containers:
                - name: my-container
                  resources:
                    requests:
                      memory: "512Mi"
                      cpu: "250m"
                    limits:
                      memory: "1Gi"
                      cpu: "500m"
          volumeClaimTemplates:
            - metadata:
                name: my-pvc
              spec:
                resources:
                  requests:
                    storage: "5Gi"
        `);

    const statefulSet = StatefulSet.from(doc);
    assert(statefulSet.metadata instanceof Metadata);
    assertEquals(statefulSet.replicas, 3);
    assert(statefulSet.containers.length === 1);
    assert(statefulSet.pvcTemplates.length === 1);

    const containerLimitSum = statefulSet.getContainerLimitsSum().multiply(
      statefulSet.replicas,
    );
    const containerRequestSum = statefulSet.getContainerRequestsSum().multiply(
      statefulSet.replicas,
    );
    assertEquals(statefulSet.toJSON(), {
      name: statefulSet.metadata.name,
      minReplicas: statefulSet.replicas,
      maxReplicas: statefulSet.replicas,
      containers: statefulSet.containers.map((container) => container.toJSON()),
      kind: Kind.StatefulSet,
      pvcs: statefulSet.pvcTemplates.map((pvc) => pvc.toJSON()),
      resourcesSum: {
        limitsCpuMillis: containerLimitSum.cpuMillis,
        limitsMemoryBytes: containerLimitSum.memoryBytes,
        requestsCpuMillis: containerRequestSum.cpuMillis!,
        requestsMemoryBytes: containerRequestSum.memoryBytes!,
        requestsStorageBytes: statefulSet.getPvcRequestsSum().multiply(
          statefulSet.replicas,
        ).storageBytes!,
      },
    });
  });
  await step("Should have default values", () => {
    const doc = parse(`
        kind: StatefulSet
        metadata:
          name: my-statefulset
        spec:
          template:
            spec:
              containers:
                - name: my-container
        `);

    const statefulSet = StatefulSet.from(doc);
    assert(statefulSet.metadata instanceof Metadata);
    assertEquals(statefulSet.replicas, 1);
    assert(statefulSet.containers.length === 1);
    assert(statefulSet.pvcTemplates.length === 0);
    assertEquals(statefulSet.toJSON(), {
      name: statefulSet.metadata.name,
      minReplicas: statefulSet.replicas,
      maxReplicas: statefulSet.replicas,
      containers: statefulSet.containers.map((container) => container.toJSON()),
      kind: Kind.StatefulSet,
      pvcs: [],
      resourcesSum: {
        limitsCpuMillis: undefined,
        limitsMemoryBytes: undefined,
        requestsCpuMillis: 0,
        requestsMemoryBytes: 0,
        requestsStorageBytes: 0,
      },
    });
  });
});
