#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. || exit 1

echo "-------------------------------------------"
echo "👉 helpers/generate-data-tables.js"
node helpers/generate-data-tables.js

echo "-------------------------------------------"
echo "👉 helpers/generate-catalog.js"
node helpers/generate-catalog.js

echo "-------------------------------------------"
echo "👉 npm run pretty-src-svg"
npm run pretty-src-svg

echo "-------------------------------------------"
echo "👉 npm run export-svg"
npm run export-svg

echo "-------------------------------------------"
echo "👉 npm run export-svg-font"
npm run export-svg-font

echo "-------------------------------------------"
echo "👉 npm run export-png"
npm run export-png
