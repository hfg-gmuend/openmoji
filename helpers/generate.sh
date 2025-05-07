#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. || exit 1

echo "-------------------------------------------"
echo "👉 helpers/generate-data-tables.js"
helpers/generate-data-tables.js

echo "-------------------------------------------"
echo "👉 helpers/generate-index-html.js"
helpers/generate-index-html.js

echo "-------------------------------------------"
echo "👉 helpers/generate-index-list-html.js"
helpers/generate-index-list-html.js

echo "-------------------------------------------"
echo "👉 helpers/pretty-src-svg.sh"
helpers/pretty-src-svg.sh

echo "-------------------------------------------"
echo "👉 helpers/export-svg.sh"
helpers/export-svg.sh

echo "-------------------------------------------"
echo "👉 helpers/pretty-exported-svg.sh"
helpers/pretty-exported-svg.sh

echo "-------------------------------------------"
echo "👉 helpers/export-png.sh"
helpers/export-png.sh

echo "-------------------------------------------"
echo "👉 helpers/clean.sh"
helpers/clean.sh
