#!/bin/sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

python3 "$ROOT/scripts/build_pages.py"
bash "$ROOT/scripts/publish.sh"

echo "Build complete: src/ and docs/ are ready."
