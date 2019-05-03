const fs = require('fs');
const _   = require('lodash');
const expect = require('chai').expect;

const getSrcFilepath = require('./utils/utils').getSrcFilepath;
const openmojis = require('../data/openmoji.json');


describe('File integrity', function() {
  const emojis = _.filter(openmojis, (e) => { return e.skintone == ''});

  describe('Source SVG exists?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have a source ${getSrcFilepath(emoji)}`, function(){
        const svgFile = getSrcFilepath(emoji);
        expect( fs.existsSync(svgFile) ).to.be.true;
      });
    });
  });

});
