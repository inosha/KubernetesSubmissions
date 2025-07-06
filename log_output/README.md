This project demonstrates a Kubernetes Pod running **two containers** (sidecar) that communicate via a shared volume (emptyDir):

- **Writer Container:** Generates a random string at startup and appends a line with the string and a timestamp to a log file every 5 seconds.
- **Reader Container:** Exposes an HTTP endpoint (`/`) that returns the current contents of the log file.

## Architecture

```mermaid
flowchart LR
    Writer -- writes --> SharedVolume["Shared Volume: /logs/output.log"]
    Reader["Reader (HTTP GET /logs)"] -- reads --> SharedVolume

```

## Usage

### 1. Build and Push Images ( optional )

Build and push both containers
Writer

`docker build -t dockerhub-user/writer:latest ./writer`

`docker push dockerhub-user/writer:latest`

Reader

`docker build -t dockerhub-user/reader:latest ./reader`

`docker push dockerhub-user/reader:latest`

### 2. Deploy to Kubernetes

Apply the manifests:

`kubectl apply -f manifests/*`

### 3. Access the Logs

If exposed via a service or ingress, access the logs at:
[`http://localhost:8081`](http://localhost:8081)

```mermaid

flowchart LR
    client["Client<br>(Browser<br>localhost:8081)"]
        -- "HTTP Request" --> portforward["Docker Desktop /<br>k3d Port mapping<br>(8081:80@loadbalancer)"]
    portforward -- "Forwards to" --> ingress[Ingress]
    ingress -- "routes to" --> service[Service]
    service -- "forwards to" --> appPod["App Pod<br>(port 3000)"]

    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:2px,color:#fff;
    class ingress,service,appPod k8s;
    class client,portforward plain;


```



 @ https://mermaid.live
