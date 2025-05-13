import { expect } from 'chai';
import fs from 'fs';
import lodash from 'lodash';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import parser from 'yargs-parser';
import { createDoc } from './utils/utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { filter } = lodash;

const argv = parser('openmoji-data-json', {
  default: {
    'openmoji-data-json': path.join(__dirname, '../data/openmoji.json')
  }
});

const openmojiDataJson = fs.readFileSync(argv['openmoji-data-json']);
const openmojis = JSON.parse(openmojiDataJson);
const colorPalette = fs.readFileSync(path.join(__dirname, '../data/color-palette.json'));
const { colors } = JSON.parse(colorPalette);

describe('Skintone', function () {
  const emojis = filter(openmojis, (e) => { return e.emoji === e.skintone_base_emoji });
  const validColors = ['#fcea2b', 'none'];

  describe('Skintone layer existing?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a #skin layer`, function () {
        const doc = createDoc(emoji);
        expect(doc.querySelector('#skin')).to.exist;
      });
    });
  });

  describe('Shapes with skintones existing?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have shapes with skintones in #skin layer`, function () {
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
