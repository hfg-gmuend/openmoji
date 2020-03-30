#!/usr/bin/env bash

if [ $# -gt 0 ]; then
    # file name passed in
    fileName=$1

    # remove old files
    echo "Remove old SVG files"
    rm color/svg/"$fileName.svg"
    rm black/svg/"$fileName.svg"

    # export svg files
    node helpers/export-svg-skintones.js $fileName
    node helpers/export-svg-color.js $fileName
    node helpers/export-svg-black.js $fileName

    # beautify exported svg files
    echo "Beautify SVG color"
    find color/svg/ -type f -name "$fileName.svg" -print0 | xargs -0 -n 1 -P 6 svgo --quiet --config helpers/beautify-svg.yml
    echo "Beautify SVG black"
    find black/svg/ -type f -name "$fileName.svg" -print0 | xargs -0 -n 1 -P 6 svgo --quiet --config helpers/beautify-svg.yml
else
    # no arguments
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
fi
