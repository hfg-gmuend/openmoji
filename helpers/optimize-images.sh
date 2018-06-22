#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

cd "$SCRIPTPATH"
/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../black/72x72/*.png
/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../black/512x512/*.png
/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../black/618x618/*.png

/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../color/72x72/*.png
/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../color/512x512/*.png
/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../color/618x618/*.png
