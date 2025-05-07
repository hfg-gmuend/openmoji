#!/bin/bash
# Adapted from helpers/pretty-src-svg.sh
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

find black color -type f -name '*.svg' |
helpers/lib/optimize-build.sh pretty-output-svg \
  xargs -L1 node_modules/.bin/svgo --quiet --config helpers/beautify-svg.yml
