import { assert, assertEquals } from "@std/assert";
import { parse } from "@std/yaml";
import { Metadata } from "../src/k8s/metadata.ts";
import { Container } from "../src/k8s/container.ts";
import { UnitUtil } from "../src/util/unit_util.ts";
import { Deployment } from "../src/k8s/deployment.ts";
import { Kind } from "../src/types.ts";
import { Hpa } from "../src/k8s/hpa.ts";
import { ScaleTargetRef } from "../src/k8s/scale_target_ref.ts";
import {ResourceAccumulator} from "../src/resource_accumulator.ts";

// Deno.test("Should parse deployment", async ({ step }) => {
//   await step("Should parse full definition", () => {
//     const doc = parse(`
//         kind: Deployment
//         metadata:
//           name: my-deployment
//         spec:
//           replicas: 3
//           template:
//             spec:
//               containers:
//                 - name: my-container
//                   resources:
//                     requests:
//                       memory: "512Mi"
//                       cpu: "250m"
//                     limits:
//                       memory: "1Gi"
//                       cpu: "500m"
//     `);
//
//     const deployment = Deployment.from(doc);
//     assert(deployment.metadata instanceof Metadata);
//     assert(deployment instanceof Deployment);
//     assert(deployment.containers.length === 1);
//     assert(deployment.containers[0] instanceof Container);
//     assertEquals(deployment.intoInfo(), {
//       name: deployment.metadata.name,
//       kind: Kind.Deployment,
//       containers: deployment.containers,
//       minReplicas: 3,
//       maxReplicas: 3,
//       resourcesSum: {
//         requestsCpuMillis: UnitUtil.parseCpuMillis("250m") * 3,
//         requestsMemoryBytes: UnitUtil.parseMemoryBytes("512Mi") * 3,
//         limitsCpuMillis: UnitUtil.parseCpuMillis("500m") * 3,
//         limitsMemoryBytes: UnitUtil.parseMemoryBytes("1Gi") * 3,
//       },
//     });
//   });
//
//   await step(
//     "Sum of requests and limits should have default value 0 and undefined when not specified on containers",
//     () => {
//       const doc = parse(`
//         kind: Deployment
//         metadata:
//           name: my-deployment
//         spec:
//           template:
//             spec:
//               containers:
//                 - name: my-container
//     `);
//
//       const deployment = Deployment.from(doc);
//       assert(deployment.metadata instanceof Metadata);
//       assert(deployment instanceof Deployment);
//       assert(deployment.containers.length === 1);
//       assert(deployment.containers[0] instanceof Container);
//       assertEquals(deployment.intoInfo(), {
//         name: deployment.metadata.name,
//         kind: Kind.Deployment,
//         containers: deployment.containers,
//         minReplicas: 1,
//         maxReplicas: 1,
//         resourcesSum: {
//           requestsCpuMillis: 0,
//           requestsMemoryBytes: 0,
//           limitsCpuMillis: undefined,
//           limitsMemoryBytes: undefined,
//         },
//       });
//     },
//   );
//
//   await step("Sum of deployment resource should react to HPA", () => {
//     const doc = parse(`
//         kind: Deployment
//         metadata:
//           name: my-deployment
//         spec:
//           replicas: 3
//           template:
//             spec:
//               containers:
//                 - name: my-container
//                   resources:
//                     requests:
//                       memory: "512Mi"
//                       cpu: "250m"
//                     limits:
//                       memory: "1Gi"
//                       cpu: "500m"
//     `);
//
//     const deployment = Deployment.from(doc);
//     deployment.setHpa(
//       new Hpa(
//         new Metadata("test"),
//         new ScaleTargetRef(Kind.Deployment, "test"),
//         5,
//         1,
//       ),
//     );
//     assertEquals(deployment.intoInfo(), {
//       name: deployment.metadata.name,
//       kind: Kind.Deployment,
//       containers: deployment.containers,
//       minReplicas: 1,
//       maxReplicas: 5,
//       resourcesSum: {
//         requestsCpuMillis: UnitUtil.parseCpuMillis("250m") * 5,
//         requestsMemoryBytes: UnitUtil.parseMemoryBytes("512Mi") * 5,
//         limitsCpuMillis: UnitUtil.parseCpuMillis("500m") * 5,
//         limitsMemoryBytes: UnitUtil.parseMemoryBytes("1Gi") * 5,
//       },
//     });
//   });
// });

Deno.test("Should sum resources", async ({ step }) => {
  await step("Should sum container resources and multiply", () => {
    const doc = parse(`
        kind: Deployment
        metadata:
          name: my-deployment
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
                - name: my-second-container
                  resources:
                    requests:
                      memory: "64Mi"
                      cpu: "250m"
                    limits:
                      memory: "128Mi"
                      cpu: "500m"
    `);

    const deployment = Deployment.from(doc);
    const resourceAcc = new ResourceAccumulator();
    deployment.intoResourceAccumulator(resourceAcc);

    const limits = resourceAcc.getContainerLimits();
    const requests = resourceAcc.getContainerRequests();

    assertEquals(requests.memoryBytes, (UnitUtil.parseMemoryBytes("64Mi") + UnitUtil.parseMemoryBytes("512Mi")) * deployment.replicas);
    assertEquals(requests.cpuMillis, (UnitUtil.parseCpuMillis("250m") + UnitUtil.parseCpuMillis("250m")) * deployment.replicas);

    assertEquals(limits.memoryBytes, (UnitUtil.parseMemoryBytes("128Mi") + UnitUtil.parseMemoryBytes("1Gi")) * deployment.replicas);
    assertEquals(limits.cpuMillis, (UnitUtil.parseCpuMillis("500m") + UnitUtil.parseCpuMillis("500m")) * deployment.replicas);
  });
});