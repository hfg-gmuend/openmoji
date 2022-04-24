const path = require('path');
const { filter } = require('lodash');
const { expect } = require('chai');

const argv = require('optimist').default('openmoji-data-json', path.join(__dirname, '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const { createDoc } = require('./utils/utils');
const { colors } = require('../data/color-palette.json');


describe('Skintone', function() {
  const emojis = filter(openmojis, (e) => { return e.emoji === e.skintone_base_emoji});
  const validColors = ['#fcea2b', 'none'];

  describe('Skintone layer existing?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a #skin layer`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelector('#skin') ).to.exist;
      });
    });
  });

  describe('Shapes with skintones existing?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have shapes with skintones in #skin layer`, function(){
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('#skin [fill] [stroke]');
        query.forEach(el => {
          expect(validColors).to.include(el.getAttribute('fill').toLowerCase());
          expect(validColors).to.include(el.getAttribute('stroke').toLowerCase());
        });
      });
    });
  });

});
