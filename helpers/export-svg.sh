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


echo Exporting non-skintone color SVGs

helpers/find-emojis.js --has-no-skintones --show-path |
while read -d $'\t' -r CODE; read -r PATH; do
  echo "color/svg/$CODE.svg:src/$PATH/$CODE.svg"
done |
tr : '\t' |
helpers/lib/optimize-build.sh export-svg-color \
  helpers/lib/export-svg-color.sh


echo Extracting black outline SVGs from all color SVGs

helpers/find-emojis.js |
while read -d $'\t' -r CODE; read -r PATH; do
  echo "black/svg/$CODE.svg:color/svg/$CODE.svg"
done |
tr : '\t' |
helpers/lib/optimize-build.sh export-svg-black \
  helpers/lib/export-svg-black.sh

helpers/clean.sh
