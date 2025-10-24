import { expect } from 'chai';
import fs from 'fs';
import lodash from 'lodash';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import parser from 'yargs-parser';
import { createDoc } from './utils/utils.js';
const { filter } = lodash;

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = parser('openmoji-data-json', {
  default: {
    'openmoji-data-json': path.join(__dirname, '../data/openmoji.json')
  }
});

const openmojisSource = fs.readFileSync(argv['openmoji-data-json']);
const openmojis = JSON.parse(openmojisSource);

import colorPaletteJson from '../data/color-palette.json' with { type: 'json'};
const { colors, skintones } = colorPaletteJson;


describe('Color', function () {
  // exclude all emojis with a skintone modifier
  let emojis = filter(openmojis, (e) => { return e.skintone == '' });
  // exclude the "Emoji Modifier Fitzpatrick"
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FB' });
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FC' });
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FD' });
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FE' });
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FF' });

  // valid colors and edge cases like 'none', or shorthand white '#fff' etc.
  const validColors = [...colors, ...skintones.fitzpatrick, '#fff', '#000', 'none'];

  describe('Fill colors included in OpenMoji color palette?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have correct fill colors`, function () {
        const doc = createDoc(emoji);
        const query = Array.from(doc.querySelectorAll('[fill]')).filter(item => !item.parentNode.closest('#grid'));
        query.forEach(el => {
          expect(validColors).to.include(el.getAttribute('fill').toLowerCase());
        });
      });
    });
  });

  describe('Stroke colors included in OpenMoji color palette?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have correct stroke colors`, function () {
        const doc = createDoc(emoji);
        const query = Array.from(doc.querySelectorAll('[stroke]')).filter(item => !item.parentNode.closest('#grid'));
        query.forEach(el => {
          expect(validColors).to.include(el.getAttribute('stroke').toLowerCase());
        });
      });
    });
  });

  describe('Black only strokes in #line layer?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg #line layer should have only black strokes`, function () {
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('#line [stroke], #line-supplement [stroke]');
        query.forEach(el => {
          expect(['black', '#000000', '#000', 'none']).to.include(el.getAttribute('stroke').toLowerCase());
        });
      });
      it(`${emoji.emoji} ${emoji.hexcode}.svg #line layer should have only black fills (if any)`, function () {
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('#line [fill], #line-supplement [fill]');
        query.forEach(el => {
          expect(['black', '#000000', '#000', 'none']).to.include(el.getAttribute('fill').toLowerCase());
        });
      });
    });
  });

});
