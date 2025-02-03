import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import { Hpa } from "../src/k8s/hpa.ts";
import { ScaleTargetRef } from "../src/k8s/scale_target_ref.ts";
import {Container} from "../src/k8s/container.ts";
import {ContainerResourceDefinition} from "../src/k8s/container_resource_definition.ts";
import {Deployment} from "../src/k8s/deployment.ts";


Deno.test("Should parse HPA", async ({ step }) => {
  await step("Should parse full definition", () => {
    const doc = parse(`
        kind: HorizontalPodAutoscaler
        metadata:
          name: my-hpa
        spec:
          scaleTargetRef:
            kind: Deployment
            name: my-deployment-with-hpa
          minReplicas: 2
          maxReplicas: 5
    `);

    const hpa = Hpa.from(doc);
    assert(hpa.metadata instanceof Metadata);
    assert(hpa.scaleTargetRef instanceof ScaleTargetRef);
    assertEquals(hpa.maxReplicas, 5);
    assertEquals(hpa.minReplicas, 2);
  });

  await step("Min replicas should have default value 1", () => {
    const doc = parse(`
        kind: HorizontalPodAutoscaler
        metadata:
          name: my-hpa
        spec:
          scaleTargetRef:
            kind: Deployment
            name: my-deployment-with-hpa
          maxReplicas: 5
    `);

    const hpa = Hpa.from(doc);
    assertEquals(hpa.minReplicas, 1);
  });

  await step("Should match on deployment", () => {
    const hpaDoc = parse(`
        kind: HorizontalPodAutoscaler
        metadata:
          name: my-hpa
        spec:
          scaleTargetRef:
            kind: Deployment
            name: my-deployment-with-hpa
          maxReplicas: 5
    `);

    const deploymentDoc = parse(`
        kind: Deployment
        metadata:
          name: my-deployment-with-hpa
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
    `);

    const hpa = Hpa.from(hpaDoc);
    const deployment = Deployment.from(hpaDoc);
    assert(hpa.match(deployment));
  });
});
