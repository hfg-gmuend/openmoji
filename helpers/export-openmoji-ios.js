#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { filter } = require('lodash');
const mkdirp = require('mkdirp');

const openmojis = require('../data/openmoji.json');
const openmojisNoSkintones = filter(openmojis, (e) => { return e.skintone === ''});

// remove emojis with multiple skintones
let openmojiForSwift = filter(openmojis, (e) => { return e.skintone_combination !== 'multiple' });
// make openmoji.json safer for iOS App
// search in Swift requires type safety for each property
openmojiForSwift = openmojis.map((openmoji, i) => {
  openmoji.order = i + 1; // start at 1
  openmoji.unicode = parseFloat(openmoji.unicode);
  if (!openmoji.unicode) openmoji.unicode = -1 // no unicode mapped to -1
  if (typeof openmoji.skintone === 'string') openmoji.skintone = -1; // no skintone mapped to -1
  return openmoji;
});

console.log("copy modified openmojis.json (safe for Swift) → openmoji-ios");
fs.writeFileSync(
  path.join('../openmoji-ios/OpenMoji/OpenMoji/Data & Model/openmoji.json'),
  JSON.stringify(openmojiForSwift, null, 2)
);

return;

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
      "grid-size" : "small"
    }
  };
  fs.writeFileSync(filepath, JSON.stringify(contents, null, 2));
}
