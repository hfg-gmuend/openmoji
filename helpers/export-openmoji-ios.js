#!/usr/bin/env node
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import lodash from 'lodash';
import mkdirp from 'mkdirp';

const { filter } = lodash;
const openmojis = JSON.parse(readFileSync(new URL('../data/openmoji.json', import.meta.url), 'utf8'));
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
writeFileSync(
  join('../openmoji-ios/OpenMoji/OpenMoji/Data & Model/openmoji.json'),
  JSON.stringify(openmojiForSwift, null, 2)
);

console.log("copy openmojis → in app stickers, with skintones");
openmojis.forEach((openmoji, i) => {
  copyFileSync(
    join('./color/618x618/', `${openmoji.hexcode}.png`) ,
    join('../openmoji-ios/images/618x618/', `${openmoji.hexcode}.png`)
  );

  const folder = `../openmoji-ios/OpenMoji/OpenMoji/General/Assets.xcassets/stickers/${openmoji.hexcode}.imageset/`;
  mkdirp.sync(folder);
  copyFileSync(
    join('./color/618x618/', `${openmoji.hexcode}.png`) ,
    join(folder, `${openmoji.hexcode}.png`)
  );
  writeStickerPngInAppContentsJson(folder, openmoji.hexcode);
});

console.log("copy openmojis → messages sticker pack, no skintones");
openmojisNoSkintones.forEach((openmoji, i) => {
  const folder = `../openmoji-ios/OpenMoji/OpenMoji Stickers/Stickers.xcassets/Sticker Pack.stickerpack/${openmoji.hexcode}.sticker/`;
  mkdirp.sync(folder);
  copyFileSync(
    join('./color/618x618/', `${openmoji.hexcode}.png`) ,
    join(folder, `${openmoji.hexcode}.png`)
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
  writeFileSync(join(filepath, 'Contents.json'), JSON.stringify(contents, null, 2));
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
  writeFileSync(join(filepath, 'Contents.json'), JSON.stringify(contents, null, 2));
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
  writeFileSync(filepath, JSON.stringify(contents, null, 2));
}
