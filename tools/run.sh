#!/bin/sh
# Dev helper: run a python tool from tools/ with Playwright available.
# usage: tools/run.sh playtest.py ch1
# Set PLAYWRIGHT_PY to a python that has playwright installed (default: python3),
# and optionally PLAYWRIGHT_BROWSERS_PATH if your browsers live somewhere custom.
PY="${PLAYWRIGHT_PY:-python3}"
script="$1"; shift
exec "$PY" "$(dirname "$0")/$script" "$@"
