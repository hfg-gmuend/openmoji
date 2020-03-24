const fs = require('fs');
const path = require('path');
const { filter } = require('lodash');
const mkdirp = require('mkdirp');

const openmojis = require('../data/openmoji.json');
const openmojisNoSkintones = filter(openmojis, (e) => { return e.skintone == ''});


console.log("copy openmojis.json → openmoji-ios");
fs.copyFileSync(
  path.join('./data/openmoji.json') ,
  path.join('../openmoji-ios/OpenMoji/OpenMoji/Data & Model/openmoji.json')
);

console.log("copy openmojis → in app stickers, with skintones");
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
  writeStickerPngInAppContentsJson(folder, openmoji.hexcode);
});

console.log("copy openmojis → messages sticker pack, no skintones");
openmojisNoSkintones.forEach((openmoji, i) => {
  const folder = `../openmoji-ios/OpenMoji/OpenMoji Stickers/Stickers.xcassets/Sticker Pack.stickerpack/${openmoji.hexcode}.sticker/`;
  mkdirp.sync(folder);
  fs.copyFileSync(
    path.join('./color/618x618/', `${openmoji.hexcode}.png`) ,
    path.join(folder, `${openmoji.hexcode}.png`)
  );
  writeStickerPngContentsJson(folder, openmoji.hexcode);
});

console.log("generating Contents.json (list of OpenMojis in stickerpack)");
writeStickerContentsJson(
  '../openmoji-ios/OpenMoji/OpenMoji Stickers/Stickers.xcassets/Sticker Pack.stickerpack/Contents.json',
  openmojisNoSkintones
);

function writeStickerPngContentsJson(filepath, hexcode) {
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

function writeStickerPngInAppContentsJson(filepath, hexcode) {
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

function writeStickerContentsJson(filepath, openmojis) {
  const stickers = openmojis.map(o => {
    return {"filename" : `${o.hexcode}.sticker`}
  });
  const contents = {
    "stickers" : stickers,
    "info" : {
      "version" : 1,
      "author" : "xcode"
    },
    "properties" : {
      "grid-size" : "regular"
    }
  };
  fs.writeFileSync(filepath, JSON.stringify(contents, null, 2));
}
