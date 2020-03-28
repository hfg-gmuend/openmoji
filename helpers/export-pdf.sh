#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

# -- color --
# Subshell to scope directory change.
(
  cd color/svg/
  # remove old files
  rm ../pdf/*.pdf
  # convert svg to pdf
  for f in *.svg; do
    echo "Export to pdf (color): $f"
    rsvg-convert -f pdf "$f" > ../pdf/"${f%%.*}.pdf"
  done
)

# -- black --
(
  cd black/svg/
  # remove old files
  rm ../pdf/*.pdf
  # convert svg to pdf
  for f in *.svg; do
  echo "Export to pdf (black): $f"
  rsvg-convert -f pdf "$f" > ../pdf/"${f%%.*}.pdf"
  done
)
