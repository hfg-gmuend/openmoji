import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import lodash from 'lodash';
import { expect } from 'chai';
import globModule from 'glob';
import emojibase from 'emojibase';
import optimist from 'optimist';

const { filter, find } = lodash;
const glob = globModule.sync;
const { fromUnicodeToHexcode, stripHexcode } = emojibase;
const argv = optimist.default('openmoji-data-json', join(dirname(fileURLToPath(import.meta.url)), '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = JSON.parse(readFileSync(openmojiDataJson, 'utf8'));


describe('Data integrity openmoji.json', function() {
  const emojis = openmojis

  describe('Every hexcode is unique in openmoji.json?', function() {
    emojis.forEach(e => {
      const {hexcode, group, subgroups} = e;
      const filtered = filter(emojis, { 'hexcode': hexcode });
      it(`${hexcode} should be unique`, function(){
        expect( filtered.length ).to.equal(1);
      });
    });
  });

  describe('Hexcode and emoji property matches in openmoji.json?', function() {
    emojis.forEach(e => {
      const {hexcode, emoji} = e;
      it(`${e.emoji} ${e.hexcode} property should be matching`, function(){
        expect( stripHexcode(hexcode) ).to.equal(fromUnicodeToHexcode(emoji));
      });
    });
  });

});
