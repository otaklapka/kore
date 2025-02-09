import { Metadata } from "../../src/k8s/metadata.ts";
import { Container } from "../../src/k8s/container.ts";
import { assert, assertEquals } from "@std/assert";
import { Hpa } from "../../src/k8s/hpa.ts";
import {
  defaultContainersStatefulSetDefinition,
  defaultContainersStatefulSetInfo,
  fullDefinedStatefulSetDefinition,
  fullDefinedStatefulSetInfo,
  mixedDefinedContainersStatefulSetDefinition,
  mixedDefinedContainersStatefulSetInfo,
  statefulSetWithHpaDefinition,
  statefulSetWithHpaHpaDefinition,
  statefulSetWithHpaInfo,
} from "./mod.ts";
import { StatefulSet } from "../../src/k8s/stateful_set.ts";

Deno.test("StatefulSet", async ({ step }) => {
  await step("Should parse full definition", () => {
    const statefulSet = StatefulSet.from(fullDefinedStatefulSetDefinition);
    assert(statefulSet.metadata instanceof Metadata);
    assert(statefulSet instanceof StatefulSet);
    assert(
      statefulSet.containers.length ===
        fullDefinedStatefulSetInfo.containers.length,
    );
    assert(
      statefulSet.containers.every((container) =>
        container instanceof Container
      ),
    );
    assertEquals(statefulSet.toJSON(), fullDefinedStatefulSetInfo);
  });

  await step(
    "Should parse with default container values",
    () => {
      const statefulSet = StatefulSet.from(
        defaultContainersStatefulSetDefinition,
      );
      assertEquals(statefulSet.toJSON(), defaultContainersStatefulSetInfo);
    },
  );

  await step(
    "Should sum up mixed defined containers",
    () => {
      const statefulSet = StatefulSet.from(
        mixedDefinedContainersStatefulSetDefinition,
      );
      assertEquals(statefulSet.toJSON(), mixedDefinedContainersStatefulSetInfo);
    },
  );

  await step(
    "Should sum up containers with HPA",
    () => {
      const hpa = Hpa.from(statefulSetWithHpaHpaDefinition);
      const statefulSet = StatefulSet.from(statefulSetWithHpaDefinition);
      statefulSet.setHpa(hpa);
      assertEquals(statefulSet.toJSON(), statefulSetWithHpaInfo);
    },
  );
});
