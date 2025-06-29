import uuid
import time

from datetime import datetime, UTC

# Generate a random string @ start
random_string = str(uuid.uuid4())  # Version 4 UUID is random

while True:
    # Get current timestamp in ISO format and replace trailing 00:00 with Z
    timestamp = datetime.now(UTC).isoformat().replace('+00:00', 'Z')

    print(f"{timestamp}: {random_string}", flush=True)
    time.sleep(5)
