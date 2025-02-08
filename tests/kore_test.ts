import { parseAll } from "@std/yaml/parse";
import { Kore } from "../src/kore.ts";
import { assertEquals } from "@std/assert";
import { UnitUtil } from "../src/util/unit_util.ts";
import { Kind } from "../src/types.ts";

Deno.test("Should extract resources from files", async ({ step }) => {
  await step("Should handle crons", async () => {
    const docs = parseAll(
      await Deno.readTextFile("./tests/data/crons.yaml"),
    ) as object[];

    const kore = new Kore(docs);
    assertEquals(kore.toJSON(), {
      "objects": [
        {
          "name": "my-cronjob",
          "containers": [
            {
              "name": "my-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("100m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("200m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
              },
            },
          ],
          "kind": Kind.CronJob,
          "resourcesSum": {
            "limitsCpuMillis": UnitUtil.parseCpuMillis("200m"),
            "limitsMemoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
            "requestsCpuMillis": UnitUtil.parseCpuMillis("100m"),
            "requestsMemoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
          },
        },
      ],
      "resourcesSum": {
        "limitsCpuMillis": UnitUtil.parseCpuMillis("200m"),
        "limitsMemoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
        "requestsCpuMillis": UnitUtil.parseCpuMillis("100m"),
        "requestsMemoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
        "requestsStorageBytes": 0,
      },
    });
  });

  await step("Should handle deployments", async () => {
    const docs = parseAll(
      await Deno.readTextFile("./tests/data/deployments.yaml"),
    ) as object[];

    const kore = new Kore(docs);

    const withHpaLimitsCpuMillis = UnitUtil.sumCpu("500m", "200m") * 5;
    const withHpaLimitsMemoryBytes = UnitUtil.sumMemory("1Gi", "512Mi") * 5;
    const withHpaRequestsCpuMillis = UnitUtil.sumCpu("250m", "100m") * 5;
    const withHpaRequestsMemoryBytes = UnitUtil.sumMemory("512Mi", "256Mi") * 5;

    const noHpaLimitsCpuMillis = UnitUtil.parseCpuMillis("500m") * 3;
    const noHpaLimitsMemoryBytes = UnitUtil.parseMemoryBytes("1Gi") * 3;
    const noHpaRequestsCpuMillis = UnitUtil.parseCpuMillis("250m") * 3;
    const noHpaRequestsMemoryBytes = UnitUtil.parseMemoryBytes("512Mi") * 3;

    assertEquals(kore.toJSON(), {
      "objects": [
        {
          "name": "my-deployment-with-hpa",
          "minReplicas": 1,
          "maxReplicas": 5,
          "containers": [
            {
              "name": "my-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("1Gi"),
              },
            },
            {
              "name": "my-next-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("100m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("200m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
              },
            },
          ],
          "kind": Kind.Deployment,
          "resourcesSum": {
            "limitsCpuMillis": withHpaLimitsCpuMillis,
            "limitsMemoryBytes": withHpaLimitsMemoryBytes,
            "requestsCpuMillis": withHpaRequestsCpuMillis,
            "requestsMemoryBytes": withHpaRequestsMemoryBytes,
          },
        },
        {
          "kind": Kind.PersistentVolumeClaim,
          "name": "my-pvc",
          "resourcesSum": {
            "requestsStorageBytes": UnitUtil.parseMemoryBytes("5Gi"),
          },
        },
        {
          "name": "my-deployment",
          "minReplicas": 3,
          "maxReplicas": 3,
          "containers": [
            {
              "name": "my-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("1Gi"),
              },
            },
          ],
          "kind": Kind.Deployment,
          "resourcesSum": {
            "limitsCpuMillis": noHpaLimitsCpuMillis,
            "limitsMemoryBytes": noHpaLimitsMemoryBytes,
            "requestsCpuMillis": noHpaRequestsCpuMillis,
            "requestsMemoryBytes": noHpaRequestsMemoryBytes,
          },
        },
      ],
      "resourcesSum": {
        "requestsCpuMillis": withHpaRequestsCpuMillis + noHpaRequestsCpuMillis,
        "requestsMemoryBytes": withHpaRequestsMemoryBytes +
          noHpaRequestsMemoryBytes,
        "limitsCpuMillis": withHpaLimitsCpuMillis + noHpaLimitsCpuMillis,
        "limitsMemoryBytes": withHpaLimitsMemoryBytes + noHpaLimitsMemoryBytes,
        "requestsStorageBytes": UnitUtil.parseMemoryBytes("5Gi"),
      },
    });
  });

  await step("Should handle jobs", async () => {
    const docs = parseAll(
      await Deno.readTextFile("./tests/data/jobs.yaml"),
    ) as object[];

    const kore = new Kore(docs);
    assertEquals(kore.toJSON(), {
      "objects": [
        {
          "name": "pi-job",
          "containers": [
            {
              "name": "pi-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("128Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
              },
            },
            {
              "name": "pi-container2",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("128Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
              },
            },
          ],
          "kind": "Job",
          "resourcesSum": {
            "limitsCpuMillis": UnitUtil.sumCpu("500m", "500m"),
            "limitsMemoryBytes": UnitUtil.sumMemory("256Mi", "256Mi"),
            "requestsCpuMillis": UnitUtil.sumCpu("250m", "250m"),
            "requestsMemoryBytes": UnitUtil.sumMemory("128Mi", "128Mi"),
          },
        },
        {
          "name": "pi-job",
          "containers": [
            {
              "name": "pi-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("128Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
              },
            },
          ],
          "kind": "Job",
          "resourcesSum": {
            "limitsCpuMillis": UnitUtil.parseCpuMillis("500m"),
            "limitsMemoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
            "requestsCpuMillis": UnitUtil.parseCpuMillis("250m"),
            "requestsMemoryBytes": UnitUtil.parseMemoryBytes("128Mi"),
          },
        },
      ],
      "resourcesSum": {
        "limitsCpuMillis": UnitUtil.sumCpu("500m", "500m", "500m"),
        "limitsMemoryBytes": UnitUtil.sumMemory("256Mi", "256Mi", "256Mi"),
        "requestsCpuMillis": UnitUtil.sumCpu("250m", "250m", "250m"),
        "requestsMemoryBytes": UnitUtil.sumMemory("128Mi", "128Mi", "128Mi"),
        "requestsStorageBytes": 0,
      },
    });
  });

  await step("Should handle stateful sets", async () => {
    const docs = parseAll(
      await Deno.readTextFile("./tests/data/stateful_sets.yaml"),
    ) as object[];

    const kore = new Kore(docs);

    const withHpaLimitsCpuMillis = UnitUtil.parseCpuMillis("500m") * 5;
    const withHpaLimitsMemoryBytes = UnitUtil.parseMemoryBytes("1Gi") * 5;
    const withHpaRequestsCpuMillis = UnitUtil.parseCpuMillis("250m") * 5;
    const withHpaRequestsMemoryBytes = UnitUtil.parseMemoryBytes("512Mi") * 5;
    const withHpaStorageMemoryBytes = UnitUtil.parseMemoryBytes("5Gi") * 5;

    const noHpaLimitsCpuMillis = UnitUtil.sumCpu("500m", "500m") * 3;
    const noHpaLimitsMemoryBytes = UnitUtil.sumMemory("1Gi", "256Mi") * 3;
    const noHpaRequestsCpuMillis = UnitUtil.sumCpu("250m", "250m") * 3;
    const noHpaRequestsMemoryBytes = UnitUtil.sumMemory("512Mi", "128Mi") * 3;
    const noHpaStorageMemoryBytes = UnitUtil.parseMemoryBytes("5Gi") * 3;

    assertEquals(kore.toJSON(), {
      "objects": [
        {
          "name": "my-statefulset-with-hpa",
          "minReplicas": 1,
          "maxReplicas": 5,
          "containers": [
            {
              "name": "my-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("1Gi"),
              },
            },
          ],
          "kind": Kind.StatefulSet,
          "pvcs": [
            {
              "kind": Kind.PersistentVolumeClaim,
              "name": "my-pvc",
              "resourcesSum": {
                "requestsStorageBytes": UnitUtil.parseMemoryBytes("5Gi"),
              },
            },
          ],
          "resourcesSum": {
            "limitsCpuMillis": withHpaLimitsCpuMillis,
            "limitsMemoryBytes": withHpaLimitsMemoryBytes,
            "requestsCpuMillis": withHpaRequestsCpuMillis,
            "requestsMemoryBytes": withHpaRequestsMemoryBytes,
            "requestsStorageBytes": withHpaStorageMemoryBytes,
          },
        },
        {
          "name": "my-statefulset",
          "minReplicas": 3,
          "maxReplicas": 3,
          "containers": [
            {
              "name": "my-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("512Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("1Gi"),
              },
            },
            {
              "name": "my-second-container",
              "requests": {
                "cpuMillis": UnitUtil.parseCpuMillis("250m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("128Mi"),
              },
              "limits": {
                "cpuMillis": UnitUtil.parseCpuMillis("500m"),
                "memoryBytes": UnitUtil.parseMemoryBytes("256Mi"),
              },
            },
          ],
          "kind": Kind.StatefulSet,
          "pvcs": [
            {
              "kind": Kind.PersistentVolumeClaim,
              "name": "my-pvc",
              "resourcesSum": {
                "requestsStorageBytes": UnitUtil.parseMemoryBytes("5Gi"),
              },
            },
          ],
          "resourcesSum": {
            "limitsCpuMillis": noHpaLimitsCpuMillis,
            "limitsMemoryBytes": noHpaLimitsMemoryBytes,
            "requestsCpuMillis": noHpaRequestsCpuMillis,
            "requestsMemoryBytes": noHpaRequestsMemoryBytes,
            "requestsStorageBytes": noHpaStorageMemoryBytes,
          },
        },
      ],
      "resourcesSum": {
        "requestsCpuMillis": withHpaRequestsCpuMillis + noHpaRequestsCpuMillis,
        "requestsMemoryBytes": withHpaRequestsMemoryBytes +
          noHpaRequestsMemoryBytes,
        "limitsCpuMillis": withHpaLimitsCpuMillis + noHpaLimitsCpuMillis,
        "limitsMemoryBytes": withHpaLimitsMemoryBytes + noHpaLimitsMemoryBytes,
        "requestsStorageBytes": withHpaStorageMemoryBytes +
          noHpaStorageMemoryBytes,
      },
    });
  });
});
