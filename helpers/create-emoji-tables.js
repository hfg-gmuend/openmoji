const fs = require('fs');
const _ = require('lodash');
const csvWriter = require('csv-write-stream');
const csvParse = require('csv-parse/lib/sync');

const emojibaseData = require('emojibase-data/en/data.json');
const emojibaseGroups = require('emojibase-data/meta/groups.json');
const groups = emojibaseGroups.groups;
const subgroups = emojibaseGroups.subgroups;


// -- helper functions --
const loadCsv = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return csvParse(content, {columns: true});
}
const arrayToEmojiDict = (array) => {
  return array.reduce((o, a) => Object.assign(o, { [a.emoji]: a }), {});
}
const writeCsv = (data, filePath) => {
  const csvOut = csvWriter();
  csvOut.pipe(fs.createWriteStream(filePath));
  for (d of data) csvOut.write(d);
  csvOut.end();
}
const writeJson = (data, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


// -- create emoji tables --
// create an empty array to hold the emoji definitions
let emojis = [];

// add emoji with skintones to list
_.each(emojibaseData, e => {
  if (e.skins) {
    e['skintone_base_emoji'] = e.emoji;
    e['skintone_base_hexcode'] = e.hexcode;
    // add skintone_base_emoji prop
    const skintones = _.map(e.skins, (s) => {
      s['skintone_base_emoji'] = e.emoji;
      s['skintone_base_hexcode'] = e.hexcode;
      return s;
    })
    emojis = [...emojis, ...skintones];
  }
  emojis = [...emojis, e];
});

// custom hfg emojis
const hfgEmojis = loadCsv('./data/hfg-custom-emojis.csv');
emojis = [...emojis, hfgEmojis];

// load custom meta informations extending the unicode definitions
const hfgExtensions = arrayToEmojiDict( loadCsv('./data/hfg-unicode-extensions.csv'), 'emoji');

// filter out what we want in the end
// enhance meta infromations of each emoji
emojis = _.map(emojis, e => {
  let hfg_author = hfgExtensions[e.emoji] ? hfgExtensions[e.emoji]['hfg_author'] : '';
  if (e.skintone_base_emoji) {
    hfg_author = hfgExtensions[e.skintone_base_emoji] ? hfgExtensions[e.skintone_base_emoji]['hfg_author'] : '';
  }
  return {
    emoji: e.emoji,
    hexcode: e.hexcode,
    group: groups[e.group],
    subgroups: subgroups[e.subgroup],
    annotation: e.annotation,
    tags: e.tags ? e.tags.join(', ') : '',
    hfg_tags: hfgExtensions[e.emoji] ? hfgExtensions[e.emoji]['hfg_tags'] : '',
    hfg_author: hfg_author,
    skintone: e.tone ? e.tone : '',
    skintone_base_emoji: e.skintone_base_emoji ? e.skintone_base_emoji : '',
    skintone_base_hexcode: e.skintone_base_hexcode ? e.skintone_base_hexcode : '',
    unicode: e.version,
    order: e.order,
  };
});

// sort by recommended order of unicode standard
emojis = _.sortBy(emojis, [(e) => { return e.order; }]);

// -- save to CSV and JSON files --
writeJson(emojis, 'data/openmoji-unicode11.json');
writeCsv(emojis, 'data/openmoji-unicode11.csv');

// remove all emojis which not have been designed yet
emojis = _.filter(emojis, (e) => { return e.hfg_author !== '' });

writeJson(emojis, 'data/openmoji.json');
writeCsv(emojis, 'data/openmoji.csv');
