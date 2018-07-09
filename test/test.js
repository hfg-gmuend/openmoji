const expect = require('chai').expect;
const fs   = require('fs');
const _   = require('lodash');
const JSDOM = require('jsdom').JSDOM;

const emojis = require('../data/openmoji.json');


describe('OpenMojis with skintone modifier', function () {
  const emojisSkintones = _.filter(emojis, (e) => { return e.skintone_base_emoji === e.emoji });
  const folderSvg = './color/svg';
  emojisSkintones.forEach(emoji => {
    
    it(emoji.hexcode + '.svg should have fills with skintone color', function(){
      const dom = new JSDOM(fs.readFileSync('./color/svg/'+emoji.hexcode+'.svg', 'utf8'));
      const doc = dom.window.document;
      const fillSkins = doc.querySelectorAll('[fill*="#FCEA2B" i]');
      expect( fillSkins.length ).to.be.above(0);
    });

  })
});
