const _ = require('lodash');
const expect = require('chai').expect;

const createDoc = require('./helpers/helpers').createDoc;
const openmojis = require('../data/openmoji.json');


describe('Layers', function() {
  describe('#Source SVG files', function() {
    const emojis = _.filter(openmojis, (e) => { return e.skintone == '' });
    emojis.forEach(emoji => {
      const doc = createDoc(emoji);
      // it(emoji.hexcode + '.svg should have a #color layer', function(){
      //   expect( doc.querySelector('#color') ).to.not.be.a('null');
      // });
      // it(emoji.hexcode + '.svg should have a #line layer', function(){
      //   expect( doc.querySelector('#line') ).to.not.be.a('null');
      // });
      it(emoji.hexcode + '.svg should have only valid layers', function() {
        const query = doc.querySelectorAll('svg > g:not(#grid):not(#line):not(#color):not(#hair):not(#skin):not(#skin-shadow):not(#color-foreground):not(#line-supplement)');
        expect(query.length).to.equal(0);
      });
    })
  });
});
