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
#
# $CORES may be specified to dictate concurrency.
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

mkdir -p {color,black}/{72x72,168x168}

export SCALE
for SCALE in 72 618; do
  echo "Scale ${SCALE}x${SCALE}"

  # Generate a list of all png files we should generate from which svg files.
  # Capture the file in git and refer back to it by its hash.
  # Using git to store temporary files avoids having to deal with temporary
  # file cleanup if this process terminates early.
  for GROUP in color black; do
      helpers/find-emojis.js "$@" | while read -r CODE; do
        SRC="$GROUP/svg/$CODE.svg"
        DST="$GROUP/${SCALE}x${SCALE}/$CODE.png"
        echo "$DST:$SRC"
    done
  done |
  tr : '\t' |
  helpers/lib/optimize-build.sh "export-png-$SCALE" \
    helpers/lib/export-png.sh

done
