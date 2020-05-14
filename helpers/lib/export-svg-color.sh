#!/bin/bash
# Used by helpers/export-svg-color.sh to generate and optimize batches of
# non-skintone color SVGs from source SVGs.
# Receives the build plan from helpers/export-svg-color.sh on stdin.
set -ueo pipefail

# Capture the build plan for replay.
# Extract only the target file column.
TARGETS=$(cut -f1 | git hash-object -w --stdin)

# Generate
git cat-file blob "$TARGETS" |
xargs helpers/lib/export-svg-color.js
# Optimize
git cat-file blob "$TARGETS" |
xargs -n1 node_modules/.bin/svgo --quiet --config helpers/beautify-svg.yml
