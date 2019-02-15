const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const JSDOM = require('jsdom').JSDOM;

const folderSrc = './src';
const folderOut = './color/svg';

const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const generateSvg = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelector('#grid');
  if (query) query.remove();
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

let emojis = require('../data/openmoji.json');
emojis = _.filter(emojis, (e) => { return e.skintone == ''});
console.log('Export SVG Color: ' + emojis.length);

emojis.forEach(e => {
  // console.log(e.hexcode);
  generateSvg(
    path.join(folderSrc, e.group, e.subgroups, e.hexcode + '.svg'),
    path.join(folderOut, e.hexcode + '.svg')
  );
});

console.log('✅', emojis.length);
