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
const { colors } = JSON.parse(readFileSync(new URL('../data/color-palette.json', import.meta.url), 'utf8'));


describe('Skintone', function() {
  const emojis = filter(openmojis, (e) => { return e.emoji === e.skintone_base_emoji});
  const validColors = ['#fcea2b', 'none'];

  describe('Skintone layer existing?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a #skin layer`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelector('#skin') ).to.exist;
      });
    });
  });

  describe('Shapes with skintones existing?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have shapes with skintones in #skin layer`, function(){
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
