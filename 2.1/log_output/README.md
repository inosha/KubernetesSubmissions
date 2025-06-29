# Log output app

Deploy with ` kubectl create deployment log-output-app --image=inosha1/log_output_app:v1 `

### Accessing Logs
`kubectl get pods`
`kubectl logs -f <pod name from the output of above command>`
