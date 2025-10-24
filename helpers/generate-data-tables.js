#!/usr/bin/env node

import csvParse from 'csv-parse/lib/sync.js';
import csvWriter from 'csv-write-stream';
import { fromCodepointToUnicode, fromHexcodeToCodepoint } from 'emojibase';
import emojibaseData from 'emojibase-data/en/data.json' with { type: 'json' };
import emojibaseGroups from 'emojibase-data/meta/groups.json' with { type: 'json' };
import fs from 'fs';
import _ from 'lodash';

const { groups, subgroups } = emojibaseGroups;

// -- helper functions --
const loadCsv = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return csvParse(content, { columns: true });
}
const arrayToEmojiDict = (array) => {
  return array.reduce((o, a) => Object.assign(o, { [String(a.hexcode)]: a }), {});
}
const writeCsv = (data, filePath) => {
  const csvOut = csvWriter();
  csvOut.pipe(fs.createWriteStream(filePath));
  for (const d of data) csvOut.write(d);
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
    e['skintone_combination'] = 'single';
    // add skintone_base_emoji prop
    const skintones = _.map(e.skins, (s) => {
      s['skintone_base_emoji'] = e.emoji;
      s['skintone_base_hexcode'] = e.hexcode;
      if (_.isArray(s.tone)) {
        // console.warn(`Warning: ${s.emoji} ${s.hexcode} is a multi skin tones combination`);
        s.tone = s.tone.join(',');
        s['skintone_combination'] = 'multiple';
      } else {
        s['skintone_combination'] = 'single';
      }
      return s;
    })
    emojis = [...emojis, ...skintones];
  }
  emojis = [...emojis, e];
});


// load custom meta informations extending the unicode definitions
const enhancements = arrayToEmojiDict(loadCsv('./data/enhancements-emoji-unicode-data.csv'), 'emoji');

// filter out what we want in the end
// enhance meta informations of each emoji
emojis = _.map(emojis, e => {
  let openmoji_author = enhancements[e.hexcode] ? enhancements[e.hexcode]['openmoji_author'] : '';
  let openmoji_date = enhancements[e.hexcode] ? enhancements[e.hexcode]['openmoji_date'] : '';
  if (e.skintone_base_hexcode) {
    openmoji_author = enhancements[e.skintone_base_hexcode] ? enhancements[e.skintone_base_hexcode]['openmoji_author'] : '';
    openmoji_date = enhancements[e.skintone_base_hexcode] ? enhancements[e.skintone_base_hexcode]['openmoji_date'] : '';
  }
  return {
    emoji: e.emoji,
    hexcode: e.hexcode,
    group: groups[e.group],
    subgroups: subgroups[e.subgroup],
    annotation: e.label,
    tags: e.tags ? e.tags.join(', ') : '',
    openmoji_tags: enhancements[e.hexcode] ? enhancements[e.hexcode]['openmoji_tags'] : '',
    openmoji_author: openmoji_author,
    openmoji_date: openmoji_date,
    skintone: e.tone ? e.tone : '',
    skintone_combination: e.skintone_combination ? e.skintone_combination : '',
    skintone_base_emoji: e.skintone_base_emoji ? e.skintone_base_emoji : '',
    skintone_base_hexcode: e.skintone_base_hexcode ? e.skintone_base_hexcode : '',
    unicode: e.version,
    order: e.order,
  };
});

// sort by recommended order of unicode standard
emojis = _.orderBy(emojis, ['order', 'group', 'subgroups', 'hexcode'], ['asc', 'asc', 'asc', 'asc']);

// -- save to CSV and JSON files --
// writeJson(emojis, 'data/openmoji-emoji-unicode.json');
// writeCsv(emojis, 'data/openmoji-emoji-unicode.csv');

// select all emojis which have not been designed yet (without skintones)
let missingEmojis = _.filter(emojis, (e) => { return e.openmoji_author === '' && e.skintone === '' });
// remove edge cases e.g. regional indicators which are not really emojis, hence don't have group/subgroups definition
missingEmojis = _.filter(missingEmojis, (e) => { return e.group !== undefined && e.subgroups !== undefined });
writeCsv(missingEmojis, 'data/openmoji-emoji-unicode-missing.csv');

// remove all emojis which have not been designed yet
const emojisAlreadyDesigned = _.filter(emojis, (e) => { return e.openmoji_author !== '' });

// add extras
let extrasOpenMoji = loadCsv('./data/extras-openmoji.csv');
extrasOpenMoji = _.map(extrasOpenMoji, e => {
  // if the emoji column is empty: generate an emoji from the hexcode
  // if the emoji column is not empty: use as it is
  const codePoint = fromHexcodeToCodepoint(e.hexcode);
  const emoji = e.emoji === '' ? fromCodepointToUnicode(codePoint) : e.emoji;
  return {
    // image: `=IMAGE("https://github.com/hfg-gmuend/openmoji/blob/v1.5/color/72x72/${e.hexcode +'.png?raw=true'}")`,
    emoji: emoji,
    hexcode: e.hexcode,
    group: e.group,
    subgroups: e.subgroups,
    annotation: e.annotation,
    tags: '',
    openmoji_tags: e.openmoji_tags,
    openmoji_author: e.openmoji_author,
    openmoji_date: e.openmoji_date,
    skintone: '',
    skintone_combination: '',
    skintone_base_emoji: '',
    skintone_base_hexcode: '',
    unicode: '',
    order: '',
  };
});
let extrasUnicode = loadCsv('./data/extras-unicode.csv');
extrasUnicode = _.map(extrasUnicode, e => {
  const codePoint = fromHexcodeToCodepoint(e.hexcode);
  const emoji = fromCodepointToUnicode(codePoint);
  return {
    emoji: emoji,
    hexcode: e.hexcode,
    group: e.group,
    subgroups: e.subgroups,
    annotation: e.annotation,
    tags: '',
    openmoji_tags: e.openmoji_tags,
    openmoji_author: e.openmoji_author,
    openmoji_date: e.openmoji_date,
    skintone: '',
    skintone_combination: '',
    skintone_base_emoji: '',
    skintone_base_hexcode: '',
    unicode: e.unicode,
    order: '',
  };
});
extrasOpenMoji = _.orderBy(extrasOpenMoji, ['order', 'group', 'subgroups', 'hexcode'], ['asc', 'asc', 'asc', 'asc']);
extrasUnicode = _.orderBy(extrasUnicode, ['order', 'group', 'subgroups', 'hexcode'], ['asc', 'asc', 'asc', 'asc']);
const openmojis = [...emojisAlreadyDesigned, ...extrasOpenMoji, ...extrasUnicode];

// -- save to CSV and JSON files --
writeJson(openmojis, 'data/openmoji.json');
writeCsv(openmojis, 'data/openmoji.csv');

// -- save JSON files for openmoji-tester --
writeJson([...emojis, ...extrasOpenMoji, ...extrasUnicode], 'data/openmoji-tester.json');
