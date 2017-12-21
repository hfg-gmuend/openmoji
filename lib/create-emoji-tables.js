const path = require('path');
const fs = require('fs');
const fsSync = require('fs-sync');
const _ = require('lodash');
const csvWriter = require('csv-write-stream');
const csvLoader = require('csv-load-sync');

const sourceDataFolder = 'data/1-src';
const derivedDataFolder = 'data/2-derived';

const emojibaseData = require('emojibase-data/en/data.json');
const emojibaseGroups = require('emojibase-data/meta/groups.json');
const groups = emojibaseGroups.groups;
const subgroups = emojibaseGroups.subgroups;
const hfgEmojisList = csvLoader(path.join(sourceDataFolder, 'hfg-emojis-list.csv'));
const hfgEmojis = hfgEmojisList.reduce((o, a) => Object.assign(o, { [a.emoji]: a }), {});

// filter out what we want in the end
// enhance with 'groups' and 'subgroups'
const emojis = _.map(emojibaseData, e => {
  return {
    emoji: e.emoji,
    hexcode: e.hexcode,
    group: groups[e.group],
    subgroups: subgroups[e.subgroup],
    annotation: e.annotation,
    tags: e.tags ? e.tags.join(',') : '',
    hfg_priority: hfgEmojis[e.emoji] ? hfgEmojis[e.emoji]['hfg-priority'] : '',
    hfg_tags: hfgEmojis[e.emoji] ? hfgEmojis[e.emoji]['hfg-tags'] : ''
  };
});

// write JSON
fsSync.write(path.join(derivedDataFolder, 'emoji-table.json'), JSON.stringify(emojis, null, 2));

// write CSV
const csvOut = csvWriter();
csvOut.pipe(fs.createWriteStream(path.join(derivedDataFolder, 'emoji-table.csv')));
for (e of emojis) csvOut.write(e);
csvOut.end()
