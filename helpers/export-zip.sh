#!/bin/bash
set -ueo pipefail

# This script may be executed or sourced from any directory.
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"/..

# -- svg and png --
helpers/create-zip.sh ../color/svg/ openmoji-svg-color.zip
helpers/create-zip.sh ../color/72x72/ openmoji-72x72-color.zip
helpers/create-zip.sh ../color/618x618/ openmoji-618x618-color.zip

helpers/create-zip.sh ../black/svg/ openmoji-svg-black.zip
helpers/create-zip.sh ../black/72x72/ openmoji-72x72-black.zip
helpers/create-zip.sh ../black/618x618/ openmoji-618x618-black.zip

# -- fonts --
cd "$SCRIPTPATH"
cd ../font
zip openmoji-font.zip OpenMoji-Black.ttf OpenMoji-Color.ttf openmoji.css demo.html -x ".*" -x "__MACOSX"
mv openmoji-font.zip ../_tmp/
