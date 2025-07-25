import os
import requests

BACKEND_URL = os.environ.get("BACKEND_URL")

# BACKEND_URL = "http://todo-backend-svc:2345/todos"

def fetch_random_wikipedia_url():
    """Returns the URL of a random Wikipedia article."""
    r = requests.get("https://en.wikipedia.org/wiki/Special:Random", allow_redirects=True)
    return r.url

def create_todo(todo_text):
    """Creates a new todo in your backend."""
    requests.post(BACKEND_URL, json={"todo": todo_text})

if __name__ == "__main__":
    url = fetch_random_wikipedia_url()
    create_todo(f"Read {url}")
