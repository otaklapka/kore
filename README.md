# kore

### (kubernetes object resources)

CLI tool to parse and sum limits and requests from kubernetes YAMLs. Designed
for easier resource quota estimation for kubernetes projects.

![kore](data/img.png)

### 🚧 Waring: WIP 🚧

### Install instructions

- clone repo
- install as command with `deno run install`

### Usage

#### Pipe in relevant objects from namespace

```
kubectl get deployments,hpa,sts,pvc,jobs -n my-namespace -o yaml | yq eval '.items[] | "---" + "\n" + (. | tostring)' - > deployment.yaml
kore deployment.yaml
```

#### Parse one or more yaml files

```
kore first-deployment.yml second-deployment.yml
```

### Flags

| Flag          | Description                                 |
| ------------- | ------------------------------------------- |
| -h, --help    | show options and description                |
| -V, --version | Show the version number for this program    |
| -o, --output  | `json`,`table` output format                |
| -v, --verbose | Print extended info about object processing |
