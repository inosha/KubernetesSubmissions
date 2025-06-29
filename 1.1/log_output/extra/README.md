# app code and docker image built info

 additional info about how log output container created, pushed to dockerhub and tshoot steps 

1. building the app image
` docker build -t inosha1/log_output_app:v1 . `

2. creating docker access token(https://app.docker.com/settings/personal-access-tokens/create)

3. Authozing push from terminal, $ docker login -u inosha1

4. Pushing image to dockerhub, $ docker push inosha1/log_output_app:v1

5. (once finished, $ docker logout)


kubectl get pods
kubectl logs -f log-output-app-8496745d4-lnlcf

kubectl delete deployment log-output-app