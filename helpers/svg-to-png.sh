#!/bin/bash
#
# Converts one SVG file to the corresponding PNG.
# Driven by export-png.sh (npm run export-png).
#
# $PWD assumed to be openmoji root.
# $GROUP e.g., black or color
# $SCALE e.g., 72 or 618
# $1 is the code point to convert
#
# $GROUP/${SCALE}x${SCALE}/svg/$1.svg is the source
# $GROUP/${SCALE]x${SCALE}/$1.png is the target
set -ueo pipefail

CODE=$1
SRC=$GROUP/svg/$CODE.svg
DST=$GROUP/${SCALE}x${SCALE}/$CODE.png

# echo "$DST"
rsvg-convert -w "$SCALE" "$SRC" > "$DST"
