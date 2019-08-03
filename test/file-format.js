const { filter } = require('lodash');
const { expect } = require('chai');

const argv = require('optimist').demand('openmoji-data-json').argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const { createDoc } = require('./utils/utils');


describe('OpenMoji file format', function() {
  const emojis = filter(openmojis, (e) => { return e.skintone == '' });

  describe('SVG element viewBox (canvas) size is correct?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg SVG element should have a viewBox attribute of 72 × 72 px`, function(){
        const doc = createDoc(emoji);
        const svg = doc.querySelector('svg');
        expect( svg.getAttribute('viewBox') ).to.equal('0 0 72 72');
      });
    });
  });

  describe('SVG element id is named "emoji"?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg SVG element should have an id named "emoji"`, function(){
        const doc = createDoc(emoji);
        const svg = doc.querySelector('svg');
        expect( svg.getAttribute('id') ).to.equal('emoji');
      });
    });
  });

  describe('SVG is styled with embedded styles / has no global css style element?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should not use global style sheets`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelector('style') ).to.not.exist;
      });
    });
  });

  describe('SVG is without any masks elements?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should not use mask elements`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelector('mask') ).to.not.exist;
      });
    });
  });

  describe('SVG has only <g> elements (layers) at top level?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should only have <g> elements at top level and no other elements`, function(){
        const doc = createDoc(emoji);
        const layers = doc.querySelectorAll('svg > g');
        const notLayers = doc.querySelectorAll('svg > :not(g)');
        expect( layers.length ).to.be.at.least(3);
        expect( notLayers.length ).to.equal(0);
      });
    });
  });

});
