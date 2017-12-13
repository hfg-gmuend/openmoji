const fs = require('fs');
const fsSync = require('fs-sync');
const _ = require('lodash');
// const punycode = require('punycode');
const csvWriter = require('csv-write-stream');

const emojibaseData = require('emojibase-data/en/data.json');
const emojibaseGroups = require('emojibase-data/meta/groups.json');
const groups = emojibaseGroups.groups;
const subgroups = emojibaseGroups.subgroups;

// filter out what we want in the end
// enhance with 'groups' and 'subgroups'
const emojis = _.map(emojibaseData, e => {
  return {
    emoji: e.emoji,
    hexcode: e.hexcode,
    group: groups[e.group],
    subgroups: subgroups[e.subgroup],
    annotation: e.annotation,
    tags: e.tags ? e.tags.join(',') : ''
  };
});

// write JSON
fsSync.write('emoji-table.json', JSON.stringify(emojis, null, 2));

// write CSV
const csv = csvWriter({
  separator: ',',
  newline: '\n',
  // filter which data should go to the csv
  headers: ['emoji', 'hexcode', 'group', 'subgroups', 'annotation', 'tags'],
  sendHeaders: true
});
csv.pipe(fs.createWriteStream('emoji-table.csv'))
for (e of emojis) {
	csv.write(e);
}
csv.end()
