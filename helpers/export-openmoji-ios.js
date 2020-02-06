const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');

const openmojis = require('../data/openmoji.json');
const openmojisNoSkintones = _.filter(openmojis, (e) => { return e.skintone == ''});


// in app stickers, with skintones
openmojis.forEach((openmoji, i) => {
  fs.copyFileSync(
    path.join('./color/618x618/', `${openmoji.hexcode}.png`) ,
    path.join('../openmoji-ios/images/618x618/', `${openmoji.hexcode}.png`)
  );

  const folder = `../openmoji-ios/OpenMoji/OpenMoji/General/Assets.xcassets/stickers/${openmoji.hexcode}.imageset/`;
  mkdirp.sync(folder);
  fs.copyFileSync(
    path.join('./color/618x618/', `${openmoji.hexcode}.png`) ,
    path.join(folder, `${openmoji.hexcode}.png`)
  );
  writeInAppContentsJson(folder, openmoji.hexcode);
});

// messages sticker pack, no skintones
openmojisNoSkintones.forEach((openmoji, i) => {
  const folder = `../openmoji-ios/OpenMoji/OpenMoji Stickers/Stickers.xcassets/Sticker Pack.stickerpack/${openmoji.hexcode}.sticker/`;
  mkdirp.sync(folder);
  fs.copyFileSync(
    path.join('./color/618x618/', `${openmoji.hexcode}.png`) ,
    path.join(folder, `${openmoji.hexcode}.png`)
  );
  writeStickerContentsJson(folder, openmoji.hexcode);
});


function writeStickerContentsJson(filepath, hexcode) {
  const contents = {
    "info" : {
      "version" : 1,
      "author" : "xcode"
    },
    "properties" : {
      "filename" : `${hexcode}.png`
    }
  };
  fs.writeFileSync(path.join(filepath, 'Contents.json'), JSON.stringify(contents, null, 2));
}

function writeInAppContentsJson(filepath, hexcode) {
  const contents = {
    "images" : [
      {
        "idiom" : "universal",
        "filename" : `${hexcode}.png`,
        "scale" : "1x"
      },
      {
        "idiom" : "universal",
        "scale" : "2x"
      },
      {
        "idiom" : "universal",
        "scale" : "3x"
      }
    ],
    "info" : {
      "version" : 1,
      "author" : "xcode"
    }
  };
  fs.writeFileSync(path.join(filepath, 'Contents.json'), JSON.stringify(contents, null, 2));
}
