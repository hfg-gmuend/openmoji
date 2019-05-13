const fs = require('fs');
const path = require('path');
const _ = require('lodash');

let emojis = require('../data/openmoji.json');
emojis = _.filter(emojis, (e) => { return e.skintone == ''});
console.log('Stickers: ' + emojis.length);

const files = emojis.map(e => {
  const png = e.hexcode + '.png';
  fs.copyFileSync(
    path.join('color', '618x618', png),
    path.join('_tmp', 'stickers', png)
  );
  return { filename: e.hexcode + '.sticker'};
});

const sortedStickers = {
  "stickers": files,
  "info" : {
    "version" : 1,
    "author" : "xcode"
  },
  "properties" : {
    "grid-size" : "small"
  }
};
// console.log(sortedStickers);

// openmoji-stickers-ios/OpenMoji Stickers/OpenMoji Stickers StickerPackExtension/Stickers.xcstickers/Sticker Pack.stickerpack/Contents.json
fs.writeFileSync(path.join('_tmp', 'Contents.json'), JSON.stringify(sortedStickers, null, 2));
