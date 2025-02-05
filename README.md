# kore

### (kubernetes object resources)

CLI tool to parse and sum limits and requests from kubernetes YAMLs

<iframe src="https://app.warp.dev/block/embed/dKDyODX6hlDQKg9y7wPd88" title="kore" style="width: 611px; height: 331px; border:0; overflow:hidden;" allow="clipboard-read; clipboard-write"></iframe>

### 🚧 Waring: WIP 🚧

### Install instructions

- clone repo
- install as command with `deno run install`

### Usage

#### Pipe in relevant objects from namespace
```
kubectl get deployments,hpa,sts,pvc -n user-services -o yaml | yq eval '.items[] | "---" + "\n" + (. | tostring)' - | kore

```

#### Parse one or more yaml files
```
kore first-deployment.yml second-deployment.yml
```
