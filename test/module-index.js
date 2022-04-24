const path = require('path');
const { expect } = require('chai');

const argv = require('optimist').default('openmoji-data-json', path.join(__dirname, '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const openmoji = require('../index');


describe('Data integrity of index.js exports', () => {

  describe('Are image paths available?', () => {
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

  describe('Is color palette available?', () => {
    it('should have some colors', () => {
      const len = openmoji.color_palette.colors.length;
      expect( len > 0 ).to.equal(true);
    });
  });

  describe('Is version tag available?', () => {
    it('should be string', () => {
      expect( openmoji.version ).to.be.a('string');
    });
  });

});
