const fs = require('fs');
const path = require('path');
const { filter, find } = require('lodash');
const { expect } = require('chai');
const glob = require('glob').sync;

const argv = require('optimist').default('openmoji-data-json', path.join(__dirname, '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const { getSrcFilepath } = require('./utils/utils');


describe('File integrity src files', function() {
  const emojis = filter(openmojis, (e) => { return e.skintone == ''});
  const srcFiles = glob('src/**/*.svg');

  describe('Source SVG files exist?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have a source ${getSrcFilepath(emoji)}`, function(){
        const svgFile = getSrcFilepath(emoji);
        expect( fs.existsSync(svgFile) ).to.be.true;
      });
    });
  });

  describe('Source SVG files listed in openmoji.json?', function() {
    srcFiles.forEach(f => {
      const [srcFolder, group, subgroups, filename] = f.split(path.sep);
      const hexcode = path.basename(filename, '.svg');
      const openmoji = find(emojis, { 'hexcode': hexcode });
      it(`${filename} should be listed in openmoji.json`, function(){
        expect( openmoji ).to.exist;
        expect( openmoji.group ).to.equal(group);
        expect( openmoji.subgroups ).to.equal(subgroups);
      });
    });
  });

});
