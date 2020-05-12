#!/bin/bash
# Used by helpers/export-svg-skintones.sh to generate and optimize batches of
# skintone SVGs from source SVGs.
# Receives the build plan from helpers/export-svg-skintones.sh on stdin.
set -ueo pipefail

# Capture the build plan for replay.
# Extract only the target file column.
TARGETS=$(cut -f1 | git hash-object -w --stdin)

# Generate
git cat-file blob "$TARGETS" |
xargs helpers/lib/export-svg-skintones.js
# Optimize
git cat-file blob "$TARGETS" |
xargs -n1 node_modules/.bin/svgo --quiet --config helpers/beautify-svg.yml
