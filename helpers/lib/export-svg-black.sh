#!/bin/bash
# Used by helpers/export-svg-black.sh to generate and optimize batches of
# non-skintone black SVGs from color SVGs.
# Receives the build plan from helpers/export-svg-black.sh on stdin.
set -ueo pipefail

# Capture the build plan for replay.
# Extract only the target file column.
TARGETS=$(cut -f1 | git hash-object -w --stdin)

# Generate
git cat-file blob "$TARGETS" |
xargs helpers/lib/export-svg-black.js
# Optimize
git cat-file blob "$TARGETS" |
xargs -n1 node_modules/.bin/svgo --quiet --config helpers/beautify-svg.yml
