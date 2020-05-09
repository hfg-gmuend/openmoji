const path = require('path');
const { filter, find } = require('lodash');
const { expect } = require('chai');
const glob = require('glob').sync;
const { fromUnicodeToHexcode, stripHexcode } = require('emojibase');

const argv = require('optimist').demand('openmoji-data-json').argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const openmoji = require('../index');

describe('Data integrity of index.js exports', () => {

  describe('The paths in openmojis', () => {
    openmoji.openmojis.forEach(om => {
      const { hexcode, emoji, openmoji_images } = om;
      it(`${emoji} ${hexcode} should have svg paths`, () => {
        const b = openmoji_images.black.svg;
        const c = openmoji_images.color.svg;
        expect( path.basename(b) ).to.equal(hexcode + '.svg');
        expect( path.basename(c) ).to.equal(hexcode + '.svg');
      });
    });
  });

  describe('Colors and skintones', () => {
    it('should have some colors', () => {
      const len = openmoji.color_palette.colors.length;
      expect( len > 0 ).to.equal(true);
    });
  });

  describe('Version', () => {
    it('should be string', () => {
      expect( openmoji.version ).to.be.a('string');
    });
  });

});
