This project demonstrates a Kubernetes Pod running **two containers** (sidecar) that communicate via a shared volume (emptyDir):

- **Writer Container:** Generates a random string at startup and appends a line with the string and a timestamp to a log file every 5 seconds.
- **Reader Container:** Exposes an HTTP endpoint (`/`) that returns the current contents of the log file.
- **pingpong Container:** Exposes an HTTP endpoint (`/pingpong`) that returns the pong <counter>.

## Architecture

```mermaid
flowchart TD
    subgraph "Pod: logoutput-dep"
        writer["Container: writer"]
        reader["Container: reader"]
        writer -- Mounts /logs --> pv[(PersistentVolumeClaim: log-pvc)]
        reader -- Mounts /logs --> pv
    end

    subgraph "Pod: pingpong-dep"
        pingpong["Container: pingpong"]
        pingpong -- Mounts /logs --> pv
    end

    pv -.->|Backed by PV| pvdef[(PersistentVolume)]

    %% Services
    logsvc["Service: log-output-svc\n(port 2345 → 3000)"]
    pingsvc["Service: pingpong-svc\n(port 2345 → 3001)"]

    reader -- Exposes 3000 --> logsvc
    pingpong -- Exposes 3001 --> pingsvc

    %% Ingress
    ingress["Ingress: log-output-ing"]
    ingress -- "/" --> logsvc
    ingress -- "/pingpong" --> pingsvc
```

 @ https://mermaid.live

## Usage

### 1. Build and Push Images ( optional )

Build and push both containers
Writer

`docker build -t dockerhub-user/writer:latest ./writer`

`docker push dockerhub-user/writer:latest`

Reader

`docker build -t dockerhub-user/reader:latest ./reader`

`docker push dockerhub-user/reader:latest`

pinpong

`docker build -t dockerhub-user/reader:latest ./pingpong`

`docker push dockerhub-user/pingpong:latest`

### 2. Deploy to Kubernetes

Apply the manifests:

`kubectl apply -f pv-pvc/*`


`kubectl apply -f manifests/*`

### 3. Access the Logs

If exposed via a service or ingress, access the logs at:
cumulative output : [`http://localhost:8081`](http://localhost:8081)

pingpong endpoint: [`http://localhost:8081/pingpong`](http://localhost:8081/pingpong)


