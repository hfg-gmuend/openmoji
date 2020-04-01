#!/bin/bash
set -ueo pipefail
IFS=$'\n\t'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

echo Exporting non-skintone color SVGs

helpers/find-emojis.js --has-no-skintones --show-path |
while read -d $'\t' -r CODE; read -r PATH; do
  echo "color/svg/$CODE.svg:src/$PATH/$CODE.svg"
done |
tr : '\t' |
helpers/lib/optimize-build.sh export-svg-color \
  helpers/lib/export-svg-color.sh
