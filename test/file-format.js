const path = require('path');
const { filter } = require('lodash');
const { expect } = require('chai');

const argv = require('optimist').default('openmoji-data-json', path.join(__dirname, '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const { createDoc, readSVG, isValidXML } = require('./utils/utils');


describe('OpenMoji file format', function() {
  const emojis = filter(openmojis, (e) => { return e.skintone == '' });

  describe('SVG is valid XML syntax?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should be valid XML syntax`, function () {
        const doc = readSVG(emoji);
        expect( isValidXML(doc) ).to.be.true;
      });
      it(`${emoji.emoji} ${emoji.hexcode}.svg elements should not have duplicate attributes`, function () {
        const doc = readSVG(emoji);
        const elements = doc.match(/<\w.*>/g);
        elements.forEach(element => {
          const attrs = element.match(/((\w|-)+)=/g);
          const dedupeAttrs = new Set(attrs);
          if (attrs) expect(attrs.length).to.equal(dedupeAttrs.size);
        });
      });
    });
  });

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

  describe('SVG is styled without a global css style element?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should not use global style sheets`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelector('style') ).to.not.exist;
      });
    });
  });

  describe('All basic shapes (rect, circle, line etc) without a style attribute?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should not contain basic shapes with a style attribute`, function(){
        const doc = createDoc(emoji);
        const elementsWithStyleAttribute = doc.querySelectorAll(':not(#grid) > [style]');
        expect( elementsWithStyleAttribute.length ).to.equal(0);
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
        const layers = doc.querySelectorAll('svg > g, svg > title');
        const notLayers = doc.querySelectorAll('svg > :not(g):not(title)');
        expect( layers.length ).to.be.at.least(3);
        expect( notLayers.length ).to.equal(0);
      });
    });
  });

});
