import { expect } from 'chai';
import { fromUnicodeToHexcode, stripHexcode } from 'emojibase';
import fs from 'fs';
import lodash from 'lodash';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import parser from 'yargs-parser';

const { filter } = lodash;

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = parser('openmoji-data-json', {
  default: {
    'openmoji-data-json': path.join(__dirname, '../data/openmoji.json')
  }
});

const openmojiDataJson = fs.readFileSync(argv['openmoji-data-json']);
const openmojis = JSON.parse(openmojiDataJson);


describe('Data integrity openmoji.json', function () {
  const emojis = openmojis

  describe('Every hexcode is unique in openmoji.json?', function () {
    emojis.forEach(e => {
      const { hexcode, group, subgroups } = e;
      const filtered = filter(emojis, { 'hexcode': hexcode });
      it(`${hexcode} should be unique`, function () {
        expect(filtered.length).to.equal(1);
      });
    });
  });

  describe('Hexcode and emoji property matches in openmoji.json?', function () {
    emojis.forEach(e => {
      const { hexcode, emoji } = e;
      it(`${e.emoji} ${e.hexcode} property should be matching`, function () {
        expect(stripHexcode(hexcode)).to.equal(fromUnicodeToHexcode(emoji));
      });
    });
  });

});
