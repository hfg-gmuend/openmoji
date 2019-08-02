const fs = require('fs');
const { filter } = require('lodash');
const { expect } = require('chai');

const argv = require('optimist').demand('openmoji-data-json').argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const { getSrcFilepath } = require('./utils/utils');


describe('File integrity', function() {
  const emojis = filter(openmojis, (e) => { return e.skintone == ''});

  describe('Source SVG exists?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have a source ${getSrcFilepath(emoji)}`, function(){
        const svgFile = getSrcFilepath(emoji);
        expect( fs.existsSync(svgFile) ).to.be.true;
      });
    });
  });

});
