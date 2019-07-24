const _ = require('lodash');
const expect = require('chai').expect;

const argv = require('optimist').demand('openmoji-data-json').argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const createDoc = require('./utils/utils').createDoc;
const colors = require('../data/color-palette.json').colors;


describe('Skintone', function() {
  const emojis = _.filter(openmojis, (e) => { return e.emoji === e.skintone_base_emoji});
  const validColors = ['#fcea2b', 'none'];

  describe('Skintones layers existing?', function() {
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
