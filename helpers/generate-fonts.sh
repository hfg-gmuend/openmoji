#!/bin/bash
set -ueo pipefail

# -- prepare assets --
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. || exit 1

# copy and prepare svg assets for OpenMoji font generator
echo "👉 generate-font-glyphs.js"
helpers/generate-font-glyphs.js

# generate css file for OpenMoji fonts
echo "👉 generate-font-css.js"
helpers/generate-font-css.js

# -- OpenMoji font generator via scfbuild Docker --
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/../font || exit 1

IMAGE='scfbuild:latest'
NAME='scfbuild_bash'

# is docker container "scfbuild_bash" running?
# if not ... start container
[[ "$(docker ps -f "name=$NAME" --format '{{.Names}}')" == "$NAME" ]] ||
docker run --name "$NAME" --rm -t -d --volume "$PWD":/wd --workdir /wd "$IMAGE" bash

# generate fonts
docker exec -ti "$NAME" bash -c "/scfbuild/bin/scfbuild -c /wd/scfbuild-color.yml"
docker exec -ti "$NAME" bash -c "/scfbuild/bin/scfbuild -c /wd/scfbuild-black.yml"

# stop container
docker stop "$NAME"
