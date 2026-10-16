#!/bin/sh
# Dev helper: run every chapter walkthrough. Pass "dist" to test the bundled build instead of index.html.
# usage: tools/test_all.sh [dist]
DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [ "$1" = "dist" ]; then export URL="file://$DIR/dist/psych.html?debug"; fi
for c in ch1 ch2 ch3; do
  echo "== $c ${URL:+(bundled)}"
  "$DIR/tools/run.sh" playtest.py "$c" 2>&1 | grep -E "errors:|FAIL|pineapple|pageerror|\[warning\]" | head -12
done
