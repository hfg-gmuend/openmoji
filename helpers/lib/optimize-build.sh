#!/bin/bash
#
# optimize-build.sh takes a build plan (a list of files to build and their
# sources) and a command.
# The build optimizer filters out all the lines where none of the input or
# output files have changed since the last run, then divides the plan into
# shards, ideally one for each CPU core.
# Each of these shards are piped to a child process running the given command.
#
# This is a utility for executing build steps like export-png.sh and
# pretty-src-svg.sh.
#
# STDIN is a plan, lines with tab delimited file names.
# $1 is the name of a git memo to use for this job.
# $2.. are the command to run for each entry in the plan, with the plan files
# as following arguments.
# $CORES is an optional number of background processes to use.
#
set -ueo pipefail
IFS=$'\n\t'

MEMO=$1
ARGS=("$@")
COMMAND=("${ARGS[@]:1:${#ARGS[@]}}")
PLAN=$(git hash-object -w --stdin)

# The number of concurrent processes to use, defaulting to 8.
CORES=${CORES:-8}

# This generates a bash array like ( - - - - - - - - ), suitable as paste
# arguments.
# Using paste - - with jot 6 (BSD) or seq 6 (Linux), for example, distributes
# the input into two tab-delimited columns.
#   > jot 6 | paste - -
#   1   2
#   3   4
#   5   6
# We later distribute these columns as shards to parallel processes using cut.
#   > seq 6 | cut -d$'\t' -f2
#   2
#   4
#   6
SHARDS=()
for ((I=0; I<CORES; I++)); do
  SHARDS["$I"]=-
done

# Create another list of all of the interesting SVG and PNG files.
FILES=$(
  git cat-file blob "$PLAN" |
  tr '\t' '\n' | sort | uniq |
  git hash-object -w --stdin
)

# Capture the hashes of all plan files.
# We will use these to determine whether the sources or targets have
# changed.
HASHES=$(
  # shellcheck disable=SC2030
  export GIT_INDEX_FILE=.git/work-index
  rm -f "$GIT_INDEX_FILE"
  git add .
  git ls-files -s -m | git hash-object -w --stdin
)

# With all the hashes of files on disk, and all the known input and output
# hashes from the previous run, determine which files need to be generated.
# We only need to generate files if their source hash or target hash differ.
SHORTPLAN=$(
  helpers/lib/optimize-build-plan.js \
    <(git cat-file blob "$PLAN") \
    <(git cat-file blob "$HASHES") \
    <((git cat-file blob refs/memos/"$MEMO" 2>/dev/null) || true) |
  git hash-object -w --stdin
)

COUNT=$(git cat-file blob "$SHORTPLAN" | wc -l | tr  -d ' ')
if [ "$COUNT" == 0 ]; then
  echo "No changes"
  exit 0
elif [ "$COUNT" == 1 ]; then
  echo "1 change"
else
  echo "$COUNT changes"
fi

# For each CPU core, we spawn a background bash script.
# We generate the script from cutting a column plan, a "shard".
for ((I=1; I<=CORES; I++)); do
  git cat-file blob "$SHORTPLAN" |
  tr '\t' : |
  paste "${SHARDS[@]}" |
  cut -f"$I" |
  tr : '\t' |
  eval "${COMMAND[@]}" &
done
for ((I=1; I<=CORES; I++)); do
  wait
done

echo "Caching refs/memos/$MEMO"

# Capture a file listing with hashes for future reference.
git update-ref refs/memos/"$MEMO" "$(
  # shellcheck disable=SC2031
  export GIT_INDEX_FILE=.git/memo-index
  rm -f "$GIT_INDEX_FILE"
  git cat-file blob "$FILES" | xargs git add
  git cat-file blob "$FILES" | xargs git ls-files -s -m |
  git hash-object -w --stdin
)"
