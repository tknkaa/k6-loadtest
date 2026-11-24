import os
import sys

base_url = os.environ.get("BASE_URL", "")
secrets = [
    base_url,
    base_url.split("://", 1)[-1],
    os.environ.get("ENDPOINT", ""),
    os.environ.get("BASIC_AUTH", ""),
    os.environ.get("BODY_TEMPLATE", ""),
]

for path in sys.argv[1:]:
    with open(path, encoding="utf-8", errors="replace") as f:
        text = f.read()
    for secret in sorted(filter(None, secrets), key=len, reverse=True):
        text = text.replace(secret, "***")
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
