#!/bin/sh
# Dev helper: run a python tool with the job-local Playwright install.
# usage: tools/run.sh smoke.py OUTDIR "js" ...
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/Users/proteus/.claude/jobs/39d3bc65/tmp/pw-browsers}"
PY="${PLAYWRIGHT_PY:-/Users/proteus/.claude/jobs/39d3bc65/tmp/venv/bin/python}"
script="$1"; shift
exec "$PY" "$(dirname "$0")/$script" "$@"
