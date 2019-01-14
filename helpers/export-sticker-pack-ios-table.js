const glob = require('glob').sync;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const emojisList = require('../data/openmoji.json');

const folders = [
  "src/smileys-people/**/*.ai",
  "src/food-drink/**/*.ai",
  "src/animals-nature/**/*.ai",
  "src/travel-places/**/*.ai",
  "src/objects/**/*.ai",
  "src/activities/**/*.ai",
  "src/flags/**/*.ai",
  "src/hfg/**/*.ai",
  "src/symbols/**/*.ai",
];

const arrayToEmojiDict = (array) => {
  return array.reduce((o, a) => Object.assign(o, { [a.hexcode]: a }), {});
}

const emojiDict = arrayToEmojiDict(emojisList)

let files = [];
_.each(folders, f => {
  files = files.concat(glob(f));
});
files = _.map(files, f => {
  const basename = path.basename(f, '.ai');
  const emojiData = emojiDict[basename];
  return { basename: basename, order: emojiData ? emojiData.order : 100000 }; // 100000 = some high number to put them last
});
// sort by offical unicode spec
files = _.sortBy(files, ['order']);
files = _.map(files, f => {
  return { filename: f.basename + '.sticker'};
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
