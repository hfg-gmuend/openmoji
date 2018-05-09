const glob = require('glob').sync;
const fs = require('fs-sync');
const path = require('path');
const _ = require('lodash');

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

let files = [];
_.each(folders, f => {
  files = files.concat(glob(f));
});
files = _.map(files, f => {
  return { filename: path.basename(f, '.ai') + '.sticker'};
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

if(!fs.exists('./_tmp/')){
  fs.mkdir('_tmp')
}

// openmoji-stickers-ios/OpenMoji Stickers/OpenMoji Stickers StickerPackExtension/Stickers.xcstickers/Sticker Pack.stickerpack/Contents.json
fs.write(path.join('_tmp', 'Contents.json'), JSON.stringify(sortedStickers, null, 2));
