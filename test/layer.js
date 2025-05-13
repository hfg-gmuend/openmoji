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

const validLayerNames = ['grid', 'line', 'color', 'hair', 'skin', 'skin-shadow', 'color-foreground', 'line-supplement'];

describe('Layers', function () {
  const emojis = filter(openmojis, (e) => { return e.skintone == '' });

  describe('#line layer existing?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a single #line layer`, function () {
        const doc = createDoc(emoji);
        expect(doc.querySelectorAll('#line').length).to.equal(1);
      });
    });
  });

  describe('#color layer existing?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a single #color layer`, function () {
        const doc = createDoc(emoji);
        expect(doc.querySelectorAll('#color').length).to.equal(1);
      });
    });
  });

  describe('#grid layer existing?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should have a single #grid layer`, function () {
        const doc = createDoc(emoji);
        expect(doc.querySelectorAll('#grid').length).to.equal(1);
      });
    });
  });

  describe('Layers (<g> elements) have valid OpenMoji layer names?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} ${emoji.hexcode}.svg should only have valid OpenMoji layers`, function () {
        const doc = createDoc(emoji);
        const query = doc.querySelectorAll('svg > g');
        query.forEach(el => {
          expect(validLayerNames).to.include(el.getAttribute('id'));
        });
      });
    });
  });

});
