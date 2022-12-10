#!/bin/bash
set -ueo pipefail

# This file uses docker and the container described in
# helpers/docker/font_builder.Dockerfile
# to build the fonts using nanoemoji

# See font/README.md for details

# -- prepare assets --
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. || exit 1

build_dir="/mnt/build"
version=$(git describe --tags)

# If we're connected to a terminal, don't flood it with ninja output,
# and enable ^C.
if [[ -t 1 ]]; then
    tty=(--tty --interactive)
else
    tty=()
fi

case "${CONTAINER_ENGINE:-unset}" in
podman)
    container_engine=podman
    ;;
docker)
    container_engine=docker
    ;;
*)
    for ce in podman docker; do
        if type -t $ce >/dev/null; then
            container_engine=$ce
            break
        fi
    done
    ;;
esac

$container_engine run \
  --volume="$PWD":/mnt:Z \
  --rm \
  "${tty[@]}" \
  --pull=always \
  "ghcr.io/jeppeklitgaard/font_builder:latest" \
  /mnt/helpers/generate-fonts-runner.sh \
    "$build_dir" "$version"

# Move to font
echo "Moving built fonts to font folder"
cp -r build/fonts/* font
