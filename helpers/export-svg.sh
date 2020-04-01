#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

# export svg files
helpers/export-svg-skintones.sh
helpers/export-svg-color.sh
helpers/export-svg-black.sh

helpers/clean.sh
