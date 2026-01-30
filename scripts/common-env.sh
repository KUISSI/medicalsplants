#!/usr/bin/env bash
# Common helpers for *nix shells
# - load_dotenv [backend|root]
# - ensure_java17 (tries to find java 17 and set JAVA_HOME for the process)

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

load_dotenv() {
  scope=${1:-root}
  if [ "$scope" = "backend" ]; then
    candidates=("$PROJECT_ROOT/backend/.env" "$PROJECT_ROOT/backend/src/main/resources/.env")
  else
    candidates=("$PROJECT_ROOT/.env" "$PROJECT_ROOT/.env.dev" "$PROJECT_ROOT/.env.prod")
  fi
  for f in "${candidates[@]}"; do
    if [ -f "$f" ]; then
      echo "Loading env from $f"
      set -o allexport
      # shellcheck disable=SC1090
      source <(grep -vE '^(\s*#|\s*$)' "$f" | sed -E 's/^(.*?)=(.*)$/export \1="\2"/') || true
      set +o allexport
      return 0
    fi
  done
  return 1
}

ensure_java17() {
  local major
  if command -v java >/dev/null 2>&1; then
    major=$(java -version 2>&1 | awk -F[\".] '/version/ {print $2; exit}') || true
  fi
  if [ "$major" = "17" ]; then
    echo "Java 17 detected"
    return 0
  fi
  # Try common locations
  candidates=("/usr/lib/jvm/java-17-openjdk" "/usr/lib/jvm/java-17-openjdk-amd64" "/usr/lib/jvm/temurin-17-jdk")
  for c in "${candidates[@]}"; do
    if [ -d "$c" ]; then
      export JAVA_HOME="$c"
      export PATH="$JAVA_HOME/bin:$PATH"
      echo "Temporarily using JAVA_HOME=$JAVA_HOME"
      return 0
    fi
  done
  echo "JDK 17 not found. Install it or set JAVA_HOME to a JDK 17." >&2
  return 1
}

# Allow sourcing
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  echo "This script is intended to be sourced: source scripts/common-env.sh"
fi
