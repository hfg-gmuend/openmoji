#!/usr/bin/env bash

# remove old files
echo "Remove old SVG files"
rm color/svg/*.svg
rm black/svg/*.svg

# export svg files
node helpers/export-svg-skintones.js
node helpers/export-svg-color.js
node helpers/export-svg-black.js

# beautify exported svg files
echo "Beautify SVG color"
find color/svg/ -type f -name '*.svg' -print0 | xargs -0 -n 1 -P 6 svgo --quiet --config helpers/beautify-svg.yml
echo "Beautify SVG black"
find black/svg/ -type f -name '*.svg' -print0 | xargs -0 -n 1 -P 6 svgo --quiet --config helpers/beautify-svg.yml
