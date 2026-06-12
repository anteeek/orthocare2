#!/bin/sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CNAME=""
if [ -f "$ROOT/docs/CNAME" ]; then
  CNAME="$(cat "$ROOT/docs/CNAME")"
fi

if command -v npm >/dev/null 2>&1 && [ -f "$ROOT/package.json" ]; then
  (cd "$ROOT" && npm run build)
fi

rm -rf "$ROOT/docs"
mkdir -p "$ROOT/docs"
rsync -a --exclude='*.backup' "$ROOT/src/" "$ROOT/docs/"

if [ -n "$CNAME" ]; then
  printf '%s\n' "$CNAME" > "$ROOT/docs/CNAME"
fi

echo "Published src/ to docs/"
