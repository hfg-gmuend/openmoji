const _   = require('lodash');
const expect = require('chai').expect;

const createDoc = require('./helpers/helpers').createDoc;
const openmojis = require('../data/openmoji.json');
const colors = require('../data/color-palette.json').colors;


describe('Color', function() {
  const emojis = _.filter(openmojis, (e) => { return e.skintone == ''});
  // valid colors and edge cases like 'none', or shorthand white '#fff' etc.
  const validColors = [...colors, '#fff', '#000', 'none'];

  describe('Fill colors included in color palette?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have correct fill colors`, function(){
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll(':not(#grid) > [fill]');
        query.forEach(el => {
          expect(validColors).to.include(el.getAttribute('fill').toLowerCase());
        });
      });
    });
  });

  describe('Stroke colors included in color palette?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have correct stroke colors`, function(){
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll(':not(#grid) > [stroke]');
        query.forEach(el => {
          expect(validColors).to.include(el.getAttribute('stroke').toLowerCase());
        });
      });
    });
  });

  describe('Black only strokes in #line layer?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg #line layer should have only black strokes`, function(){
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('#line > [stroke]');
        query.forEach(el => {
          expect(['black', '#000000', '#000', 'none']).to.include(el.getAttribute('stroke').toLowerCase());
        });
      });
    });
  });

});
