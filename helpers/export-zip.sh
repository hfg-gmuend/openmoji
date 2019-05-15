#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

create_zip () {
   echo "Parameter #1 is $1"
   cd "$SCRIPTPATH"
   cd $1
   zip -r $2 . -x ".*" -x "__MACOSX"
   mv $2 ../../_tmp/
}

# -- svg and png --
create_zip ../color/svg/ openmoji-svg-color.zip
create_zip ../color/72x72/ openmoji-72x72-color.zip
create_zip ../color/618x618/ openmoji-618x618-color.zip

create_zip ../black/svg/ openmoji-svg-black.zip
create_zip ../black/72x72/ openmoji-72x72-black.zip
create_zip ../black/618x618/ openmoji-618x618-black.zip

# -- fonts --
cd "$SCRIPTPATH"
cd ../font
zip openmoji-font.zip OpenMoji-Black.ttf OpenMoji-Color.ttf openmoji.css demo.html -x ".*" -x "__MACOSX"
mv openmoji-font.zip ../_tmp/
