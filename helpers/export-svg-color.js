const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const beautify = require('js-beautify').html;
const JSDOM = require('jsdom').JSDOM;

const folderSrc = './src';
const folderOut = './color/svg';

const writeSvg = (filePath, data) => {
  const content = beautify(data, { indent_size: 2, max_preserve_newlines: "-1" });
  fs.writeFileSync(filePath, content);
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
