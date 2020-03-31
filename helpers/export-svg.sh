#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

# remove old files
echo "Remove old SVG files"
rm -f color/svg/*.svg
rm -f black/svg/*.svg

# export svg files
node helpers/export-svg-skintones.js
node helpers/export-svg-color.js
node helpers/export-svg-black.js

# beautify exported svg files
echo "Beautify SVG color"
find color/svg/ -type f -name '*.svg' -print0 | xargs -0 -n 1 -P 6 svgo --quiet --config helpers/beautify-svg.yml
echo "Beautify SVG black"
find black/svg/ -type f -name '*.svg' -print0 | xargs -0 -n 1 -P 6 svgo --quiet --config helpers/beautify-svg.yml
