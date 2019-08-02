const { filter } = require('lodash');
const { expect } = require('chai');

const argv = require('optimist').demand('openmoji-data-json').argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const { createDoc } = require('./utils/utils');


describe('File format', function() {
  const emojis = filter(openmojis, (e) => { return e.skintone == '' });

  describe('SVG viewBox (canvas) size correct?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg SVG element should have a viewBox attribute of 72 × 72 px`, function(){
        const doc = createDoc(emoji);
        const svg = doc.querySelector('svg');
        expect( svg.getAttribute('viewBox') ).to.equal('0 0 72 72');
      });
    });
  });

  describe('SVG id named "emoji"?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg SVG element should have an id named "emoji"`, function(){
        const doc = createDoc(emoji);
        const svg = doc.querySelector('svg');
        expect( svg.getAttribute('id') ).to.equal('emoji');
      });
    });
  });

  describe('SVG onyl styled with embedded styles on elements / has no global css style element?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should not use global style sheets`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelector('style') ).to.not.exist;
      });
    });
  });

});
