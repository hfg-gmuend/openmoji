#!/bin/bash

set -o errexit
set -o nounset

name=$1
saturation=$2
version=$3
format=$4
build_dir=$5


mkdir -p "$build_dir"
rsync -ru "/mnt/$saturation/svg/" "$build_dir/scale/"
grep -FL 'transform="scale(1.3)"' "$build_dir"/scale/*.svg \
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
    --color_format="$format" \
    --build_dir="$build_dir" \
    --output_file="$build_dir/$name.$format.ttf" \
    "$build_dir"/scale/*.svg

sed "s/Color/${saturation^}/;" \
    /mnt/font/OpenMoji-Color.ttx \
    > "$build_dir/$name.ttx"

xmlstarlet edit --inplace --update \
    '/ttFont/name/namerecord[@nameID="5"][@platformID="3"]' \
    --value "$version" \
    "$build_dir/$name.ttx"
ttx -m "$build_dir/$name.$format.ttf" \
    -o "/mnt/font/$format/$name.ttf" \
    "$build_dir/$name.ttx"
