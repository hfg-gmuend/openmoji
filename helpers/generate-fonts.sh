#!/bin/bash
set -ueo pipefail

# -- prepare assets --
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. || exit 1


# -- OpenMoji COLR TTF font generator via nanoemoji container --
version=$(git describe --tags)

# If we're connected to a terminal, don't flood it with ninja output,
# and enable ^C.
if [[ -t 1 ]]; then
    tty=(--tty --interactive)
else
    tty=()
fi

image=registry.gitlab.com/mavit/nanoemoji-container:master
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

${container_engine:?Not found. Please install Podman or Docker} pull $image

# FIXME: Upgrade glyf_colr_0 to glyf_colr_1 once
# https://github.com/googlefonts/colr-gradients-spec stabilises.
#
for saturation in black color; do
    build_dir=/mnt/build/$saturation

    case $saturation in
    black)
        formats=(glyf)
        ;;
    color)
        formats=(glyf_colr_0 picosvgz untouchedsvgz)
        ;;
    esac

    for format in "${formats[@]}"; do
        mkdir -p "font/$format"

        $container_engine run \
            --volume="$PWD":/mnt:Z \
            --rm \
            "${tty[@]}" \
            $image \
            bash /mnt/helpers/generate-ttf.sh \
                "$saturation" "$version" "$format" "$build_dir"

        helpers/generate-font-css.js "font/$format/openmoji.css"
    done
done
