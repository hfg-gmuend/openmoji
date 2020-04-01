#!/bin/bash
set -ueo pipefail

SRC=$1
DST=$(dirname "$2")
BASE=$(basename "$2")

# Use a subshell to scope the directory change.
(
  cd "$SRC"
  zip -r "$BASE" . -x ".*" -x "__MACOSX"
)
mkdir -p "$DST"
mv "$SRC/$BASE" "$DST"
