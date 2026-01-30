#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Load env and ensure Java 17
source "$ROOT_DIR/scripts/common-env.sh"
load_dotenv backend || true
ensure_java17 || true

JAR="$ROOT_DIR/backend/target/medicalsplants-api-1.0.0-SNAPSHOT.jar"
if [ ! -f "$JAR" ]; then
  echo "Jar introuvable: $JAR" >&2
  exit 1
fi

# Start app in background
JAVA_CMD=${JAVA_HOME:+"$JAVA_HOME/bin/java"}
if [ -z "$JAVA_CMD" ]; then
  JAVA_CMD=java
fi

echo "Starting backend jar with $JAVA_CMD"
$JAVA_CMD -jar "$JAR" >/tmp/medicalsplants-smoke.log 2>&1 &
PID=$!
trap "echo 'Stopping app'; kill $PID || true" EXIT

# Wait for health endpoint
URL="http://localhost:8080/actuator/health"
TIMEOUT=60
for i in $(seq 1 $TIMEOUT); do
  if curl -sSf "$URL" >/dev/null 2>&1; then
    echo "Smoke test: health OK"
    EXIT_CODE=0
    break
  fi
  sleep 1
  echo -n "."
done

if [ -z "${EXIT_CODE+x}" ]; then
  echo "Smoke test failed: health endpoint didn't respond within ${TIMEOUT}s"
  echo "Last logs:"
  tail -n 200 /tmp/medicalsplants-smoke.log || true
  exit 2
fi

# Print a short log and exit
echo "App started, printing startup snippet:"
head -n 200 /tmp/medicalsplants-smoke.log || true

# cleanup done by trap
exit 0
