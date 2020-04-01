#!/bin/bash
set -ueo pipefail
IFS=$'\t\n'

# Compares files in the build directories against a list of file names that
# should exist.
# The comm -23 command takes column A and B as input files and writes out all
# those entries that were in A but not in B.
# We use "process substitution" notation to run two commands as subprocesses
# and pass them to comm as file descriptors like /dev/fd/63.
EXTRA=$(
  comm -23 <(
    find color black -type f |
    sort
  ) <(
    helpers/find-emojis.js | while read -r CODE; do
      for GROUP in color black; do
        echo "$GROUP/svg/$CODE.svg"
        for SIZE in 72x72 618x618; do
          echo "$GROUP/$SIZE/$CODE.png"
        done
      done
    done |
    tr '\t' '\n' |
    sort
  ) |
  git hash-object -w --stdin
)

COUNT=$(git cat-file blob "$EXTRA" | wc -l | tr -d ' ')

# Report this step only if files are being removed.
if [ "$COUNT" -gt 0 ]; then
  git cat-file blob "$EXTRA" |
    xargs echo "Removing extraneous files:"
  git cat-file blob "$EXTRA" |
    xargs rm
fi
