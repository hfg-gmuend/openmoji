import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import lodash from 'lodash';
import { expect } from 'chai';
import optimist from 'optimist';

const { filter } = lodash;
const argv = optimist.default('openmoji-data-json', join(dirname(fileURLToPath(import.meta.url)), '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = JSON.parse(readFileSync(openmojiDataJson, 'utf8'));

import { getSrcFilepath } from './utils/utils.js';


describe('File integrity black/color production files', function() {
  const emojis = openmojis;

  describe('Production svg files exist?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have black/svg/${emoji.hexcode}.svg`, function(){
        const filepath = join('black', 'svg', `${emoji.hexcode}.svg`);
        expect( existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have color/svg/${emoji.hexcode}.svg`, function(){
        const filepath = join('color', 'svg', `${emoji.hexcode}.svg`);
        expect( existsSync(filepath) ).to.be.true;
      });
    });
  });

  describe('Production png files exist?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have black/72x72/${emoji.hexcode}.png`, function(){
        const filepath = join('black', '72x72', `${emoji.hexcode}.png`);
        expect( existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have black/618x618/${emoji.hexcode}.png`, function(){
        const filepath = join('black', '618x618', `${emoji.hexcode}.png`);
        expect( existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have color/72x72/${emoji.hexcode}.png`, function(){
        const filepath = join('color', '72x72', `${emoji.hexcode}.png`);
        expect( existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have color/618x618/${emoji.hexcode}.png`, function(){
        const filepath = join('color', '618x618', `${emoji.hexcode}.png`);
        expect( existsSync(filepath) ).to.be.true;
      });
    });
  });

});
