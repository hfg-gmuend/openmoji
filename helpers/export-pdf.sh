#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# -- color --
cd "$SCRIPTPATH"
cd ../color/svg/
echo `pwd`
# remove old files
rm ../pdf/*.pdf
# convert svg to pdf
for f in *.svg; do
  echo "Export to pdf (color): $f"
  rsvg-convert -f pdf ./"$f" > ../pdf/"${f%%.*}.pdf"
done

# -- black --
cd "$SCRIPTPATH"
cd ../black/svg/
echo `pwd`
# remove old files
rm ../pdf/*.pdf
# convert svg to pdf
for f in *.svg; do
  echo "Export to pdf (black): $f"
  rsvg-convert -f pdf ./"$f" > ../pdf/"${f%%.*}.pdf"
done
