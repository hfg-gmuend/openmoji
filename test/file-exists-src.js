import { expect } from 'chai';
import fs from 'fs';
import _glob from 'glob';
import lodash from 'lodash';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import parser from 'yargs-parser';
import { getSrcFilepath } from './utils/utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { filter, find } = lodash;
const { sync: glob } = _glob;

const argv = parser('openmoji-data-json', {
  default: {
    'openmoji-data-json': path.join(__dirname, '../data/openmoji.json')
  }
});

const openmojiDataJson = fs.readFileSync(argv['openmoji-data-json']);
const openmojis = JSON.parse(openmojiDataJson);

describe('File integrity src files', function () {
  const emojis = filter(openmojis, (e) => { return e.skintone == '' });
  const srcFiles = glob('src/**/*.svg');

  describe('Source SVG files exist?', function () {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have a source ${getSrcFilepath(emoji)}`, function () {
        const svgFile = getSrcFilepath(emoji);
        expect(fs.existsSync(svgFile)).to.be.true;
      });
    });
  });

  describe('Source SVG files listed in openmoji.json?', function () {
    srcFiles.forEach(f => {
      const [srcFolder, group, subgroups, filename] = f.split(path.sep);
      const hexcode = path.basename(filename, '.svg');
      const openmoji = find(emojis, { 'hexcode': hexcode });
      it(`${filename} should be listed in openmoji.json`, function () {
        expect(openmoji).to.exist;
        expect(openmoji.group).to.equal(group);
        expect(openmoji.subgroups).to.equal(subgroups);
      });
    });
  });

});
