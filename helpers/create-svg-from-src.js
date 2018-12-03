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
  doc.querySelector('#grid').remove();
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

let emojis = require('../data/openmoji.json');
console.log('Loaded emoijs: ' + emojis.length);
emojis = _.filter(emojis, (e) => { return e.skintone == ''});

emojis.forEach(e => {
  generateSvg(
    path.join(folderSrc, e.group, e.subgroups, e.hexcode + '.svg'),
    path.join(folderOut, e.hexcode + '.svg')
  );
});

console.log('✅', emojis.length);
