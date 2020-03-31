#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

# -- color --
# Use a subshell to scope the directory change.
(
  cd color/svg
  # remove old files
  rm -f ../72x72/*.png
  rm -f ../618x618/*.png
  echo "convert color svgs to pngs"
  for f in *.svg; do
    # echo "Export to png (color): $f"
    rsvg-convert -w 72 "$f" > ../72x72/"${f%%.*}.png" &
    rsvg-convert -w 618 "$f" > ../618x618/"${f%%.*}.png" &
    wait
  done
  echo "crush png to 256 colors with transparent background"
  find ../72x72 -name '*.png' -print0 | xargs -0 -P8 -L4 pngquant --ext .png --force 256 &
  find ../618x618 -name '*.png' -print0 | xargs -0 -P8 -L4 pngquant --ext .png --force 256 &
  wait
)

# -- black --
(
  cd black/svg
  # remove old files
  rm -f ../72x72/*.png
  rm -f ../618x618/*.png
  echo "convert black svgs to pngs"
  for f in *.svg; do
    # echo "Export to png (black): $f"
    rsvg-convert -w 72 ./"$f" > ../72x72/"${f%%.*}.png" &
    rsvg-convert -w 618 ./"$f" > ../618x618/"${f%%.*}.png" &
    wait
  done
  echo "crush png to 256 colors with transparent background"
  find ../72x72 -name '*.png' -print0 | xargs -0 -P8 -L4 pngquant --ext .png --force 256 &
  find ../618x618 -name '*.png' -print0 | xargs -0 -P8 -L4 pngquant --ext .png --force 256 &
  wait
)
