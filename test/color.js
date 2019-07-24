const _ = require('lodash');
const expect = require('chai').expect;

const argv = require('optimist').demand('openmoji-data-json').argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const createDoc = require('./utils/utils').createDoc;
const colors = require('../data/color-palette.json').colors;


describe('Color', function() {
  // exclude all emojis with a skintone modifier
  let emojis = _.filter(openmojis, (e) => { return e.skintone == ''});
  // exclude the "Emoji Modifier Fitzpatrick"
  emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FB'});
  emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FC'});
  emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FD'});
  emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FE'});
  emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FF'});

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
        const query = doc.querySelectorAll('#line > [stroke], #line-supplement > [stroke]');
        query.forEach(el => {
          expect(['black', '#000000', '#000', 'none']).to.include(el.getAttribute('stroke').toLowerCase());
        });
      });
      it(`${emoji.emoji} ${emoji.hexcode}.svg #line layer should have only black or white fills (if any)`, function(){
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('#line > [fill], #line-supplement > [fill]');
        query.forEach(el => {
          expect(['black', '#000000', '#000', 'white', '#ffffff', '#fff', 'none']).to.include(el.getAttribute('fill').toLowerCase());
        });
      });
    });
  });

});
