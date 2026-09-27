import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import lodash from 'lodash';
import { expect } from 'chai';
import optimist from 'optimist';

const { filter } = lodash;
const argv = optimist.default('openmoji-data-json', join(dirname(fileURLToPath(import.meta.url)), '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = JSON.parse(readFileSync(openmojiDataJson, 'utf8'));

import { createDoc } from './utils/utils.js';
const { colors, skintones } = JSON.parse(readFileSync(new URL('../data/color-palette.json', import.meta.url), 'utf8'));


describe('Color', function() {
  // exclude all emojis with a skintone modifier
  let emojis = filter(openmojis, (e) => { return e.skintone == ''});
  // exclude the "Emoji Modifier Fitzpatrick"
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FB'});
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FC'});
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FD'});
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FE'});
  emojis = filter(emojis, (e) => { return e.hexcode !== '1F3FF'});

  // valid colors and edge cases like 'none', or shorthand white '#fff' etc.
  const validColors = [...colors, ...skintones.fitzpatrick, '#fff', '#000', 'none'];

  describe('Fill colors included in OpenMoji color palette?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have correct fill colors`, function(){
        const doc = createDoc(emoji);
        const query = Array.from(doc.querySelectorAll('[fill]')).filter(item => !item.parentNode.closest('#grid'));
        query.forEach(el => {
          expect(validColors).to.include(el.getAttribute('fill').toLowerCase());
        });
      });
    });
  });

  describe('Stroke colors included in OpenMoji color palette?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have correct stroke colors`, function(){
        const doc = createDoc(emoji);
        const query = Array.from(doc.querySelectorAll('[stroke]')).filter(item => !item.parentNode.closest('#grid'));
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
        const query = doc.querySelectorAll('#line [stroke], #line-supplement [stroke]');
        query.forEach(el => {
          expect(['black', '#000000', '#000', 'none']).to.include(el.getAttribute('stroke').toLowerCase());
        });
      });
      it(`${emoji.emoji} ${emoji.hexcode}.svg #line layer should have only black fills (if any)`, function(){
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('#line [fill], #line-supplement [fill]');
        query.forEach(el => {
          expect(['black', '#000000', '#000', 'none']).to.include(el.getAttribute('fill').toLowerCase());
        });
      });
    });
  });

});
