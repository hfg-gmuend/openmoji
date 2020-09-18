#!/bin/bash
set -ueo pipefail

# -- prepare assets --
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/.. || exit 1

# generate css file for OpenMoji fonts
echo "👉 generate-font-css.js"
helpers/generate-font-css.js


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
case "${CONTAINER_ENGINE:-docker}" in
podman)
    container_engine=podman
    ;;
*)
    container_engine=docker
    ;;
esac

$container_engine pull $image

# FIXME: Upgrade glyf_colr_0 to glyf_colr_1 once
# https://github.com/googlefonts/colr-gradients-spec stabilises.
#
for saturation in black color; do
    name=OpenMoji-${saturation^}
    build_dir=/mnt/build/$saturation

    case $saturation in
    black)
        formats=(glyf)
        ;;
    color)
        formats=(glyf_colr_0 picosvgz)
        ;;
    esac

    for format in "${formats[@]}"; do
        mkdir -p "font/$format"

        $container_engine run \
            --volume="$PWD":/mnt:Z \
            --rm \
            "${tty[@]}" \
            $image \
            bash -c "
                set -o errexit

                mkdir -p $build_dir
                rsync -ru /mnt/$saturation/svg/ $build_dir/scale/
                grep -FL 'transform=\"scale(1.3)\"' $build_dir/scale/*.svg \
                    | xargs --no-run-if-empty \
                        xmlstarlet edit \
                            --inplace \
                            --omit-decl \
                            -N svg=http://www.w3.org/2000/svg \
                            --delete '/svg:svg/@transform' \
                            --insert '/svg:svg' \
                            --type attr \
                            --name transform \
                            --value 'translate(36 0) scale(1.3) translate(-36 0)'

                nanoemoji \
                    --color_format=$format \
                    --build_dir=$build_dir \
                    --output_file=$build_dir/$name.$format.ttf \
                    $build_dir/scale/*.svg

                sed \"s/Color/${saturation^}/;\" /mnt/font/OpenMoji-Color.ttx > $build_dir/$name.ttx

                xmlstarlet edit --inplace --update \
                    '/ttFont/name/namerecord[@nameID=\"5\"][@platformID=\"3\"]' \
                    --value '$version' \
                    $build_dir/$name.ttx
                ttx \
                    -m $build_dir/$name.$format.ttf \
                    -o /mnt/font/$format/$name.ttf \
                    $build_dir/$name.ttx
            "
    done
done
