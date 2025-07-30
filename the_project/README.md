# Project Deployment

This project server at HTTP endpoint :

- **Endpoint:** `http://localhost:8081/`

## How to Deploy

Apply the Kubernetes manifests using:

`kubectl kustomize .`	Builds and prints the rendered YAML manifests


`kubectl apply -k .`	Builds and applies the manifests to the connected cluster
