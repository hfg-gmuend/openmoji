#!/bin/bash
set -ueo pipefail
IFS=$'\n\t'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

echo Extracting black outline SVGs from all color SVGs

helpers/find-emojis.js |
while read -d $'\t' -r CODE; read -r PATH; do
  echo "black/svg/$CODE.svg:color/svg/$CODE.svg"
done |
tr : '\t' |
helpers/lib/optimize-build.sh export-svg-black \
  helpers/lib/export-svg-black.sh
