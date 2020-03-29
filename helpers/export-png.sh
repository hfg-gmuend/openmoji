#!/bin/bash
#
# Converts and quantizes all color and black SVGs to the corresponding PNGs in
# both the 72x72 and 618x618 resolutions.
#
# Uses data/openmoji.csv as the source of truth for which code points exist and
# consequently will not generate an image for an SVG that is not tracked and
# generate-data-tables.js must be run first.
#
# Usage: npm run export-png

set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

rm -rf {color,black}/{72x72,618x618}
mkdir -p {color,black}/{72x72,618x618}

for GROUP in color black; do
  for SCALE in 72 618; do
    # echo "Creating $GROUP ${SCALE}x${SCALE} PNGs"
    tail -n +2 data/openmoji.csv | cut -d, -f2 |
      GROUP="$GROUP" SCALE="$SCALE" xargs -P8 -L1 helpers/svg-to-png.sh
  done
done

# echo "Quantizing all generated PNGs"
# All quantization deferred and run in aggregate to minimize page faults.
find {color,black}/{72x72,618x618} -name '*.png' -print0 |
  xargs -0 -P8 -L4 pngquant --ext .png --force 256
