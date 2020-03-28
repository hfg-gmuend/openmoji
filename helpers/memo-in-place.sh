#!/bin/bash
#
# memo-in-place.sh uses a command to rewrite a file in place and caches the
# input and output in git so future invocations for the same input produce the
# same output immediately.
# Using this memo results in a speedup for subsequent runs of the same command
# and allows for partial progress for large batches if they are aborted.
#
# Usage: MEMO=MEMO memo-in-place.sh COMMAND... FILE
#
# $MEMO must be the name of a git memo reference, unique to the given command,
# that will serve as a cache.
# The command may have any number of arguments and must accept standard input
# and produce standard output.
# It may be necessary to use flags like -i - and -o - to produce this behavior.
# The final argument is the file to read and write.
#
# $NO_MEMO=on forces a build from source.
#
# $MEMO_DEBUG=on writes a debug marker.
#  + indicates a cache miss
#  - indicates a cache hit that altered a file
#  · indicates a cache hit but no changes needed
#
# To clear the cache:
#  git update-ref -d $MEMO
# To share the cache:
#  git push/pull $REMOTE refs/notes/$MEMO -f
#
set -ueo pipefail
IFS=$'\t\n'

# Emits a single character for each cache hit or miss.
function debug() {
  if [ -n "${MEMO_DEBUG:-}" ]; then
    echo -n "$1" >&2
  fi
}

# The command is all but the final arument.
# The final argument is the file to read and maybe rewrite.
# Bash arrays are convoluted; handle with care.
ARGS=("$@")
COMMAND=("${ARGS[@]:0:${#ARGS[@]}-1}")
FILE=${ARGS[*]: -1}
# The space between the colon and -1 distinguishes the negative index from the
# default operator, ":-".

# Capture and hash the input file.
INPUT=$(git hash-object -w "$FILE")

# Attempt to find the corresponding output hash in the given memo and write it out.
if [ -z "${NO_MEMO:-}" ] && OUTPUT=$(git notes --ref "$MEMO" show "$INPUT" 2>/dev/null); then
  if [ "$INPUT" != "$OUTPUT" ]; then
    # This can fail if the note has been pruned.
    if git cat-file blob "$OUTPUT" > "$FILE" 2>/dev/null; then
      debug - # Hit
      exit 0
    fi
  else
    debug · # No change
    exit 0
  fi
fi
debug + # Miss

# Failing that, construct an output hash and store the result in a git note.
OUTPUT=$(git cat-file blob "$INPUT" | eval "${COMMAND[@]}" | git hash-object -w --stdin)
# Since this memoizes in place, note both the input->output mapping and the
# output->output mapping assuming that the command is both consistent and
# idempotent.
git notes --ref="$MEMO" add -f -m "$OUTPUT" "$INPUT" 2>/dev/null
git notes --ref="$MEMO" add -f -m "$OUTPUT" "$OUTPUT" 2>/dev/null

# Write the output back only if it differs from the input.
# This of course belies the assumption that hash equivalence implies content
# equivalence.
if [ "$INPUT" != "$OUTPUT" ]; then
  git cat-file blob "$OUTPUT" > "$FILE"
fi
