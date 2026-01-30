#!/usr/bin/env bash
# Simple dev launcher (Linux / macOS / Git Bash)
# Usage: bash scripts/run-dev.sh
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Ensure .env
if [ ! -f ".env" ] && [ -f ".env.dev" ]; then
  cp .env.dev .env
  echo "Copied .env.dev -> .env"
elif [ -f .env ]; then
  echo ".env already exists"
else
  echo "No .env or .env.dev found — continuing without .env" >&2
fi

# Try to find JDK17
if java -version 2>&1 | grep 'version' | grep -q '"17\.'; then
  echo "Java 17 detected"
else
  for c in "/usr/lib/jvm/java-17-openjdk" "/usr/lib/jvm/java-17-openjdk-amd64" "/usr/lib/jvm/temurin-17-jdk"; do
    if [ -d "$c" ]; then
      export JAVA_HOME="$c"
      export PATH="$JAVA_HOME/bin:$PATH"
      echo "Temporarily using JAVA_HOME=$JAVA_HOME"
      break
    fi
  done
fi

# Build (skip tests for speed). If build fails, retry with enforcer skip
set +e
(cd backend && mvn -B -DskipTests package)
RC=$?
set -e
if [ $RC -ne 0 ]; then
  echo "Build failed, retrying with enforcer skip..."
  (cd backend && mvn -B '-Denforcer.skip=true' -DskipTests package)
fi

JAR=$(ls -t backend/target/*-SNAPSHOT.jar 2>/dev/null | grep -v '\.original' | head -n1)
if [ -z "$JAR" ]; then
  echo "Jar not found. Build failed." >&2
  exit 1
fi

JAVA_CMD=${JAVA_HOME:+"$JAVA_HOME/bin/java"}
if [ -z "$JAVA_CMD" ]; then
  JAVA_CMD=java
fi

echo "Starting backend with $JAVA_CMD -jar $JAR"
$JAVA_CMD -jar "$JAR" 2>&1 | tee /tmp/medicalsplants.log
