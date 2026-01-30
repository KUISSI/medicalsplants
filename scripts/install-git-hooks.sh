#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK_SRC="$ROOT_DIR/scripts/pre-commit"
HOOK_DEST="$ROOT_DIR/.git/hooks/pre-commit"
if [ ! -d "$ROOT_DIR/.git" ]; then
  echo "This repository doesn't seem to have a .git directory. Run this script from a git clone." >&2
  exit 1
fi
cp "$HOOK_SRC" "$HOOK_DEST"
chmod +x "$HOOK_DEST"
echo "Installed git hooks (pre-commit)"
