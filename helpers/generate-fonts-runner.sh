#!/bin/bash

set -o errexit
set -o nounset
set -o xtrace

# This runs inside the docker image generated using helpers/docker/font_builder.Dockerfile

# TODO, blocked: Once color formats have stabilised stop generating old font formats
# like cbdt, glyf_colr_0, and sbix

# TODO, blocked: Once we fully trust picosvg and nanoemoji in all use-cases
# disable generation of untouchedsvgz

# TODO: Perhaps disable zopflipng generation later since it doesn't seem
# to lead to significant file reductions

# TODO: Investigate whether ascenders and descenders need to be tuned to get
# slightly larger emojis in the fonts

build_dir=$1
version=$2

mkdir -p "$build_dir"

# Change these to enable/disable formats
# Remember to update font/README.md accordingly
methods_black=(glyf)
methods_color=(cbdt glyf_colr_0 glyf_colr_1 sbix picosvgz untouchedsvgz)

saturations=(black color)
for saturation in "${saturations[@]}"; do
    case "$saturation" in
    black)
        methods=("${methods_black[@]}")
        ;;

    color)
        methods=("${methods_color[@]}")
        ;;
    esac

    mkdir -p "$build_dir/$saturation"

    for method in "${methods[@]}"; do
        cat >"$build_dir/$saturation/OpenMoji-$saturation-$method.toml" <<-EOF
output_file = "$build_dir/$saturation/OpenMoji-$saturation-$method.ttf"
color_format = "$method"
ascender = 1045
descender = -275

[axis.wght]
name = "Weight"
default = 400

[master.regular]
style_name = "Regular"

# To quickly check build reverse comments below
srcs = ["/mnt/$saturation/svg/*.svg"]
# srcs = ["/mnt/$saturation/svg/1F923.svg", "/mnt/$saturation/svg/1F1E9-1F1F0.svg"]

[master.regular.position]
wght = 400
EOF
    done

    # Generate font
    nanoemoji --build_dir="$build_dir/$saturation" "$build_dir/$saturation/"*.toml

    for method in "${methods[@]}"; do
        # Generate XML for font
        sed "s/Color/${saturation^}/;" \
            /mnt/data/OpenMoji-Color.ttx \
            > "$build_dir/$saturation/OpenMoji-$saturation-$method.ttx"

        # Add version to XML
        xmlstarlet edit --inplace --update \
            '/ttFont/name/namerecord[@nameID="5"][@platformID="3"]' \
            --value "$version" \
            "$build_dir/$saturation/OpenMoji-$saturation-$method.ttx"

        mkdir -p "$build_dir/fonts/OpenMoji-$saturation-$method"

        # Add XML to font
        ttx -m "$build_dir/$saturation/OpenMoji-$saturation-$method.ttf" \
            -o "$build_dir/fonts/OpenMoji-$saturation-$method/OpenMoji-$saturation-$method.ttf" \
            "$build_dir/$saturation/OpenMoji-$saturation-$method.ttx"

        # Compress with WOFF2
        woff2_compress "$build_dir/fonts/OpenMoji-$saturation-$method/OpenMoji-$saturation-$method.ttf"

        # Generate font demo
        /mnt/helpers/generate-font-demo.js "OpenMoji-$saturation-$method.woff2" "$build_dir/fonts/OpenMoji-$saturation-$method"
    done
done

for colr_version in 0 1; do
    # Make TTF with both COLR and SVG font data in it
    mkdir -p "$build_dir/fonts/OpenMoji-color-colr${colr_version}_svg"

    cp \
        "$build_dir/fonts/OpenMoji-color-glyf_colr_${colr_version}/OpenMoji-color-glyf_colr_${colr_version}.ttf"\
        "$build_dir/fonts/OpenMoji-color-colr${colr_version}_svg/OpenMoji-color-colr${colr_version}_svg.ttf"

    maximum_color "$build_dir/fonts/OpenMoji-color-colr${colr_version}_svg/OpenMoji-color-colr${colr_version}_svg.ttf"

    woff2_compress "$build_dir/fonts/OpenMoji-color-colr${colr_version}_svg/OpenMoji-color-colr${colr_version}_svg.ttf"

    /mnt/helpers/generate-font-demo.js\
        "OpenMoji-color-colr${colr_version}_svg.woff2"\
        "$build_dir/fonts/OpenMoji-color-colr${colr_version}_svg"
done

echo "Done building fonts!"
