# Project Deployment

This project server at HTTP endpoint :

- **Endpoint:** `http://localhost:8081/`

## How to Deploy

Apply the Kubernetes manifests using:

`kubectl apply -f ./manifests`

![screenshot](./Screenshot.png)


## Architecture
![alt text](image.png)

## Verify

Check that the applications are running in the new namespace:


kubectl get pods --namespace=project