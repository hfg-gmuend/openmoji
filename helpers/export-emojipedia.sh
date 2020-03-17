#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

create_zip () {
   cd "$SCRIPTPATH"
   cd $1
   zip -r $2 . -x ".*" -x "__MACOSX"
   mv $2 ../../_tmp/
}

# -- color --
cd "$SCRIPTPATH"
cd ../color/svg/
# remove old files
rm ../512x512/*.png
echo "convert color svgs to pngs"
for f in *.svg; do
  # echo "Export to png (color): $f"
  rsvg-convert -w 512 ./"$f" > ../512x512/"${f%%.*}.png"
done
echo "crush png to 256 colors with transparent background"
find ../512x512 -name '*.png' -print0 | xargs -0 -P8 -L4 pngquant --ext .png --force 256

# -- Zip --
cd "$SCRIPTPATH"
create_zip ../color/512x512/ openmoji-512x512-color.zip
