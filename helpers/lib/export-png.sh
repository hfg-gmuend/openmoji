#!/bin/bash
set -ueo pipefail

# Capture plan so we can replay.
PLAN=$(git hash-object -w --stdin)

git cat-file blob "$PLAN" |
while read -r -d$'\t' DST; read -r SRC; do
  rsvg-convert -w "$SCALE" "$SRC" > "$DST"
done

git cat-file blob "$PLAN" |
cut -f1 |
xargs pngquant --ext .png --force 256
