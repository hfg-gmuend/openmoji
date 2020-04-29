#!/bin/bash
set -ueo pipefail

# Capture plan so we can replay.
PLAN=$(git hash-object -w --stdin)

git cat-file blob "$PLAN" |
while read -r -d$'\t' SRC; read -r DST; do
  rsvg-convert -w "$SCALE" "$SRC" > "$DST"
done

git cat-file blob "$PLAN" |
cut -f2 |
xargs pngquant --ext .png --force 256
