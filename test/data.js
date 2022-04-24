const fs = require('fs');
const path = require('path');
const { filter, find } = require('lodash');
const { expect } = require('chai');
const glob = require('glob').sync;
const { fromUnicodeToHexcode, stripHexcode } = require('emojibase');

const argv = require('optimist').default('openmoji-data-json', path.join(__dirname, '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);


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
