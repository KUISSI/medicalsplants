#!/usr/bin/env bash
# Check local Java version against .java-version
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ ! -f "$ROOT_DIR/.java-version" ]; then
  echo ".java-version not found. Expected 17." >&2
  exit 1
fi
expected=$(cat "$ROOT_DIR/.java-version" | tr -d ' \n')
if ! command -v java >/dev/null 2>&1; then
  echo "java not found in PATH" >&2
  exit 1
fi
major=$(java -version 2>&1 | awk -F[\".] '/version/ {print $2; exit}') || true
if [ "$major" = "$expected" ]; then
  echo "Java version OK: $major"
  exit 0
else
  echo "Java version mismatch: expected $expected, found $major" >&2
  exit 2
fi
