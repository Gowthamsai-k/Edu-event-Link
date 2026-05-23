import urllib.request
import json
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "I_like_to_poop"
ALGORITHM = "HS256"

# 1. Generate token
expire = datetime.utcnow() + timedelta(minutes=60)
token = jwt.encode({"sub": "2310030371@klh.edu.in", "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

def api_request(url, method="GET", data=None):
    req = urllib.request.Request(url, headers=headers, method=method)
    if data is not None:
        req.data = json.dumps(data).encode("utf-8")
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
        return None

# 2. Get posts before like
print("--- FETCH POSTS (BEFORE TOGGLE) ---")
posts = api_request("http://localhost:8000/posts")
print(json.dumps(posts, indent=2))

# 3. Toggle like
print("\n--- TOGGLE LIKE ---")
like_res = api_request("http://localhost:8000/posts/1/like", method="POST")
print(json.dumps(like_res, indent=2))

# 4. Get posts after like
print("\n--- FETCH POSTS (AFTER TOGGLE) ---")
posts_after = api_request("http://localhost:8000/posts")
print(json.dumps(posts_after, indent=2))
