#!/bin/bash
set -ueo pipefail
IFS=$'\n\t'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

echo Exporting skintone SVGs

helpers/find-emojis.js --has-skintones --show-skintone-base --show-path |
while read -r -d $'\t' -r CODE; read -r -d $'\t' BASE; read -r PATH; do
  echo "color/svg/$CODE.svg:src/$PATH/$BASE.svg"
done |
tr : '\t' |
helpers/lib/optimize-build.sh export-svg-skintones \
  helpers/lib/export-svg-skintones.sh
