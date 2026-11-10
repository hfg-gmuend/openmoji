import { readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from 'chai';
import optimist from 'optimist';
import openmoji, { color_palette, openmojis, version } from '../index.js';

const argv = optimist.default('openmoji-data-json', join(dirname(fileURLToPath(import.meta.url)), '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const expectedOpenmojis = JSON.parse(readFileSync(openmojiDataJson, 'utf8'));


describe('Data integrity of index.js exports', () => {

  it('should expose the named ESM exports', () => {
    expect(openmoji.openmojis).to.equal(openmojis);
    expect(openmoji.color_palette).to.equal(color_palette);
    expect(openmoji.version).to.equal(version);
  });

  it('should preserve the data entry count', () => {
    expect(openmoji.openmojis).to.have.lengthOf(expectedOpenmojis.length);
  });

  describe('Are image paths available?', () => {
    openmoji.openmojis.forEach(om => {
      const { hexcode, emoji, openmoji_images } = om;
      it(`${emoji} ${hexcode} should have svg paths`, () => {
        const b = openmoji_images.black.svg;
        const c = openmoji_images.color.svg;
        expect( basename(b) ).to.equal(hexcode + '.svg');
        expect( basename(c) ).to.equal(hexcode + '.svg');
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
