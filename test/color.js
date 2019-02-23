const _   = require('lodash');
const expect = require('chai').expect;

const createDoc = require('./helpers/helpers').createDoc;
const openmojis = require('../data/openmoji.json');
const colors = require('../data/color-palette.json').colors;


describe('Colors', function() {
  describe('#Source SVG files', function() {
    let emojis = _.filter(openmojis, (e) => { return e.skintone == ''});
    // emojis = _.filter(openmojis, (e) => { return e.hexcode == 'E25A'});

    // create a mega query string with all valid colors and edge cases like 'none', or shorthand white '#fff' etc.
    const validColor = [...colors, '#fff', '#000', 'none', '#b3b3b3', '#00a5ff'];
    let queryStr = '[fill]';
    validColor.forEach(c => {
      queryStr += ':not([fill*="'+c.toLowerCase()+'"])';
      queryStr += ':not([fill*="'+c.toUpperCase()+'"])';
    });
    // console.log(queryStr);
    emojis.forEach(emoji => {
      const doc = createDoc(emoji);
      it(emoji.hexcode + '.svg should have valid colors', function(){
        const query = doc.querySelectorAll(queryStr);
        // query.forEach(el => { console.log(el.getAttribute('fill')) });
        expect( query.length ).to.equal(0);
      });
    })
  });
});
