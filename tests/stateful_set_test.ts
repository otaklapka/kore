import { assert, assertEquals } from "@std/assert";
import { Deployment } from "../src/k8s/deployment.ts";
import { parse } from "@std/yaml";
import { StatefulSet } from "../src/k8s/stateful_set.ts";
import { Metadata } from "../src/k8s/metadata.ts";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
        apiVersion: apps/v1
        kind: StatefulSet
        metadata:
          name: my-statefulset
          namespace: default
        spec:
          serviceName: "my-service"
          replicas: 3
          selector:
            matchLabels:
              app: my-app
          template:
            metadata:
              labels:
                app: my-app
            spec:
              containers:
                - name: my-container
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
                  volumeMounts:
                    - name: my-pvc
                      mountPath: /data
          volumeClaimTemplates:
            - metadata:
                name: my-pvc
              spec:
                accessModes: ["ReadWriteOnce"]
                resources:
                  requests:
                    storage: "5Gi"
        `);

  const statefulSet = StatefulSet.from(yml);
  assert(statefulSet.metadata instanceof Metadata);
  assertEquals(statefulSet.replicas, 3);
  assert(statefulSet.containers.length === 1);
  console.assert(statefulSet.pvcTemplates.length === 1);
});

Deno.test("replicas field should be default 1 and pvc templates is optional", () => {
  const yml = parse(`
        apiVersion: apps/v1
        kind: StatefulSet
        metadata:
          name: my-statefulset
          namespace: default
        spec:
          serviceName: "my-service"
          selector:
            matchLabels:
              app: my-app
          template:
            metadata:
              labels:
                app: my-app
            spec:
              containers:
                - name: my-container
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
                  volumeMounts:
                    - name: my-pvc
                      mountPath: /data
        `);

  const statefulSet = StatefulSet.from(yml);
  assert(statefulSet.metadata instanceof Metadata);
  assertEquals(statefulSet.replicas, 1);
  assert(statefulSet.containers.length === 1);
  console.assert(statefulSet.pvcTemplates.length === 0);
});
