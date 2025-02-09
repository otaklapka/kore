import { Deployment } from "../../src/k8s/deployment.ts";
import { Metadata } from "../../src/k8s/metadata.ts";
import { Container } from "../../src/k8s/container.ts";
import {
  defaultContainersDeploymentDefinition,
  defaultContainersDeploymentInfo,
  deploymentWithHpaDefinition,
  deploymentWithHpaHpaDefinition,
  deploymentWithHpaInfo,
  fullDefinedDeploymentDefinition,
  fullDefinedDeploymentInfo,
  mixedDefinedContainersDeploymentDefinition,
  mixedDefinedContainersDeploymentInfo,
} from "./mod.ts";
import { assert, assertEquals } from "@std/assert";
import { Hpa } from "../../src/k8s/hpa.ts";

Deno.test("Deployments", async ({ step }) => {
  await step("Should parse full definition", () => {
    const deployment = Deployment.from(fullDefinedDeploymentDefinition);
    assert(deployment.metadata instanceof Metadata);
    assert(deployment instanceof Deployment);
    assert(deployment.containers.length === 3);
    assert(
      deployment.containers.every((container) =>
        container instanceof Container
      ),
    );
    assertEquals(deployment.toJSON(), fullDefinedDeploymentInfo);
  });

  await step(
    "Should parse with default container values",
    () => {
      const deployment = Deployment.from(defaultContainersDeploymentDefinition);
      assertEquals(deployment.toJSON(), defaultContainersDeploymentInfo);
    },
  );

  await step(
    "Should sum up mixed defined containers",
    () => {
      const deployment = Deployment.from(
        mixedDefinedContainersDeploymentDefinition,
      );
      assertEquals(deployment.toJSON(), mixedDefinedContainersDeploymentInfo);
    },
  );

  await step(
    "Should sum up containers with HPA",
    () => {
      const hpa = Hpa.from(deploymentWithHpaHpaDefinition);
      const deployment = Deployment.from(deploymentWithHpaDefinition);
      deployment.setHpa(hpa);
      assertEquals(deployment.toJSON(), deploymentWithHpaInfo);
    },
  );
});
