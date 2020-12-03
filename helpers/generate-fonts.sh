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
        methods=(glyf)
        ;;
    color)
        methods=(glyf_colr_0 picosvgz untouchedsvgz)
        ;;
    esac

    for method in "${methods[@]}"; do
        mkdir -p "font/$method"

        case "$method" in
        cbdt)
          format=.CBDT
          ;;
        *_colr_0)
          format=.COLRv0
          ;;
        *_colr_1)
          format=.COLRv1
          ;;
        glyf)
          format=
          ;;
        sbix)
          format=.sbix
          ;;
        *svg*)
          format=.SVG
          ;;
        esac

        $container_engine run \
            --volume="$PWD":/mnt:Z \
            --rm \
            "${tty[@]}" \
            $image \
            bash /mnt/helpers/generate-ttf.sh \
                "$saturation" "$version" "$format" "$method" "$build_dir"

        helpers/generate-font-css.js "$format" "font/$method/openmoji.css"
    done
done
