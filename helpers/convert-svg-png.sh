#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

cd "$SCRIPTPATH"
cd ../color/svg/
echo `pwd`
for f in *.svg; do
  rsvg-convert -w 72 ./"$f" > ../72x72/"${f%%.*}.png"
  rsvg-convert -w 512 ./"$f" > ../512x512/"${f%%.*}.png"
  rsvg-convert -w 618 ./"$f" > ../618x618/"${f%%.*}.png"
done

cd "$SCRIPTPATH"
cd ../black/svg/
echo `pwd`
for f in *.svg; do
  rsvg-convert -w 72 ./"$f" > ../72x72/"${f%%.*}.png"
  rsvg-convert -w 512 ./"$f" > ../512x512/"${f%%.*}.png"
  rsvg-convert -w 618 ./"$f" > ../618x618/"${f%%.*}.png"
done
