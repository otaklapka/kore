import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import { Hpa } from "../src/k8s/hpa.ts";
import { ScaleTargetRef } from "../src/k8s/scale_target_ref.ts";

Deno.test("Should parse all HPA fields", () => {
  const yml = parse(`
        apiVersion: autoscaling/v2beta2
        kind: HorizontalPodAutoscaler
        metadata:
          name: my-hpa
          namespace: default
        spec:
          scaleTargetRef:
            apiVersion: apps/v1
            kind: Deployment
            name: my-deployment-with-hpa
          minReplicas: 2
          maxReplicas: 5
          metrics:
            - type: Resource
              resource:
                name: cpu
                target:
                  type: Utilization
                  averageUtilization: 50
    `);

  const hpa = Hpa.from(yml);
  assert(hpa.metadata instanceof Metadata);
  assert(hpa.scaleTargetRef instanceof ScaleTargetRef);
  assertEquals(hpa.maxReplicas, 5);
  assertEquals(hpa.minReplicas, 2);
});

Deno.test("minReplicas should be default 1", () => {
  const yml = parse(`
        apiVersion: autoscaling/v2beta2
        kind: HorizontalPodAutoscaler
        metadata:
          name: my-hpa
          namespace: default
        spec:
          scaleTargetRef:
            apiVersion: apps/v1
            kind: Deployment
            name: my-deployment-with-hpa
          maxReplicas: 5
          metrics:
            - type: Resource
              resource:
                name: cpu
                target:
                  type: Utilization
                  averageUtilization: 50
    `);

  const hpa = Hpa.from(yml);
  assert(hpa.metadata instanceof Metadata);
  assert(hpa.scaleTargetRef instanceof ScaleTargetRef);
  assertEquals(hpa.maxReplicas, 5);
  assertEquals(hpa.minReplicas, 1);
});
