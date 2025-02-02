import { assert, assertEquals } from "@std/assert";
import { Deployment } from "../src/k8s/deployment.ts";
import { parse } from "@std/yaml";

Deno.test("Should parse all fields", () => {
  const yml = parse(`
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: my-deployment
    namespace: default
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: my-app-with-hpa
    template:
      metadata:
        labels:
          app: my-app-with-hpa
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
  `);

  const deploy = Deployment.from(yml);
  assertEquals(deploy.metadata.name, "my-deployment");
  assertEquals(deploy.replicas, 3);
  assert(deploy.containers.length > 0);
});

Deno.test("Replica field should have default value 1", () => {
  const yml = parse(`
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: my-deployment
    namespace: default
  spec:
    selector:
      matchLabels:
        app: my-app-with-hpa
    template:
      metadata:
        labels:
          app: my-app-with-hpa
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
  `);

  const deploy = Deployment.from(yml);
  assertEquals(deploy.metadata.name, "my-deployment");
  assertEquals(deploy.replicas, 1);
  assert(deploy.containers.length > 0);
});
