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
const validLayerNames = ['grid', 'line', 'color', 'hair', 'skin', 'skin-shadow', 'color-foreground', 'line-supplement'];


describe('Layers', function() {
  const emojis = filter(openmojis, (e) => { return e.skintone == '' });

  describe('#line layer existing?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a single #line layer`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelectorAll('#line').length ).to.equal(1);
      });
    });
  });

  describe('#color layer existing?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a single #color layer`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelectorAll('#color').length ).to.equal(1);
      });
    });
  });

  describe('#grid layer existing?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a single #grid layer`, function(){
        const doc = createDoc(emoji);
        expect( doc.querySelectorAll('#grid').length ).to.equal(1);
      });
    });
  });

  describe('Layers (<g> elements) have valid OpenMoji layer names?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should only have valid OpenMoji layers`, function() {
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('svg > g');
        query.forEach(el => {
          expect(validLayerNames).to.include(el.getAttribute('id'));
        });
      });
    });
  });

});
