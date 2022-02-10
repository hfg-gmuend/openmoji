const fs = require('fs');
const path = require('path');
const { filter } = require('lodash');
const { expect } = require('chai');

const argv = require('optimist').default('openmoji-data-json', path.join(__dirname, '../data/openmoji.json')).argv;
const openmojiDataJson = argv['openmoji-data-json'];
const openmojis = require(openmojiDataJson);

const { getSrcFilepath } = require('./utils/utils');


describe('File integrity black/color production files', function() {
  const emojis = openmojis;

  describe('Production svg files exist?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have black/svg/${emoji.hexcode}.svg`, function(){
        const filepath = path.join('black', 'svg', `${emoji.hexcode}.svg`);
        expect( fs.existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have color/svg/${emoji.hexcode}.svg`, function(){
        const filepath = path.join('color', 'svg', `${emoji.hexcode}.svg`);
        expect( fs.existsSync(filepath) ).to.be.true;
      });
    });
  });

  describe('Production png files exist?', function() {
    emojis.forEach(emoji => {
      it(`${emoji.emoji} should have black/72x72/${emoji.hexcode}.png`, function(){
        const filepath = path.join('black', '72x72', `${emoji.hexcode}.png`);
        expect( fs.existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have black/618x618/${emoji.hexcode}.png`, function(){
        const filepath = path.join('black', '618x618', `${emoji.hexcode}.png`);
        expect( fs.existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have color/72x72/${emoji.hexcode}.png`, function(){
        const filepath = path.join('color', '72x72', `${emoji.hexcode}.png`);
        expect( fs.existsSync(filepath) ).to.be.true;
      });
      it(`${emoji.emoji} should have color/618x618/${emoji.hexcode}.png`, function(){
        const filepath = path.join('color', '618x618', `${emoji.hexcode}.png`);
        expect( fs.existsSync(filepath) ).to.be.true;
      });
    });
  });

});
