import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import lodash from 'lodash';
import { expect } from 'chai';
import globModule from 'glob';
import optimist from 'optimist';

const { filter, find } = lodash;
const glob = globModule.sync;
const argv = optimist.default('openmoji-data-json', join(dirname(fileURLToPath(import.meta.url)), '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = JSON.parse(readFileSync(openmojiDataJson, 'utf8'));

import { getSrcFilepath } from './utils/utils.js';


describe('File integrity src files', function() {
  const emojis = filter(openmojis, (e) => { return e.skintone == ''});
  const srcFiles = glob('src/**/*.svg');

  describe('Source SVG files exist?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have a source ${getSrcFilepath(emoji)}`, function(){
        const svgFile = getSrcFilepath(emoji);
        expect( existsSync(svgFile) ).to.be.true;
      });
    });
  });

  describe('Source SVG files listed in openmoji.json?', function() {
    srcFiles.forEach(f => {
      const [srcFolder, group, subgroups, filename] = f.split(sep);
      const hexcode = basename(filename, '.svg');
      const openmoji = find(emojis, { 'hexcode': hexcode });
      it(`${filename} should be listed in openmoji.json`, function(){
        expect( openmoji ).to.exist;
        expect( openmoji.group ).to.equal(group);
        expect( openmoji.subgroups ).to.equal(subgroups);
      });
    });
  });

});
