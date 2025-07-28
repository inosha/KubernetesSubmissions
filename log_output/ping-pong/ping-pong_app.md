ping-pong_app application generates an output line "Ping / Pongs: <N> " with the access count(N) of the /pingpong endpoint 



ex: Ping / Pongs: 3

### exercise 3.1

kubectl apply -f deployment-todo-backend.yaml -f namespace.yaml -f postgres-stset.yaml -f postgress-secret.yaml -f postgress-secret.yaml