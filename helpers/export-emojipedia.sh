#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

var= #raise error

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

# -- color --
# Use a subshell to scope the directory change.
(
  cd color/svg
  # remove old files
  rm ../512x512/*.png
  echo "convert color svgs to pngs"
  for f in *.svg; do
    # echo "Export to png (color): $f"
    rsvg-convert -w 512 "$f" > ../512x512/"${f%%.*}.png"
  done
  echo "crush png to 256 colors with transparent background"
  find ../512x512 -name '*.png' -print0 \
    | xargs -0 -P8 -L4 pngquant --ext .png --force 256
)

# -- Zip --
helpers/create-zip.sh color/512x512/ _tmp/openmoji-512x512-color.zip
