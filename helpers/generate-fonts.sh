#!/bin/bash
set -ueo pipefail

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/../font || exit 1

IMAGE='scfbuild:latest'
NAME='scfbuild_bash'

# is docker container "scfbuild_bash" running?
# if not ... start container
[[ "$(docker ps -f "name=$NAME" --format '{{.Names}}')" == "$NAME" ]] ||
docker run --name "$NAME" --rm -t -d --volume "$PWD":/wd --workdir /wd "$IMAGE" bash

# generate fonts
docker exec -ti "$NAME" bash -c "/scfbuild/bin/scfbuild -c /wd/scfbuild-color.yml"
docker exec -ti "$NAME" bash -c "/scfbuild/bin/scfbuild --glyph-only -c /wd/scfbuild-black.yml"

# stop container
docker stop "$NAME"
