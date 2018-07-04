const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const JSDOM = require('jsdom').JSDOM;

const fitzpatrick = ['#FADCBC', '#E0BB95', '#BF8F68', '#9B643D', '#594539'];
const folderIn = './color/svg';
const folderOut = './_tmp/svg-skintones';

const writeSvg = (filePath, data) => {
  const head = '<!--?xml version="1.0" encoding="utf-8"?-->' + '\n';
  fs.writeFileSync(filePath, head + data);
}

const generateSkintoneSvg = (srcFilePath, destFilePath, skintone) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const fillSkins = doc.querySelectorAll('[fill*="#FCEA2B" i]');
  if (fillSkins.length === 0) console.error('Error: No skintone defined in ' + srcFilePath);
  fillSkins.forEach(s => { s.setAttribute('fill', skintone); });
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

let emojis = require('../data/openmoji.json');
console.log('Loaded emoijs: ' + emojis.length);
// TODO: Check is this correct?
emojis = _.filter(emojis, (e) => { return e.skintone_base_emoji !== '' && e.skintone_base_emoji !== e.emoji });
console.log('Loaded emoijs with skintones: ' + emojis.length);

emojis.forEach(e => {
  generateSkintoneSvg(
    path.join(folderIn, e.skintone_base_hexcode + '.svg'),
    path.join(folderOut, e.hexcode + '.svg'),
    fitzpatrick[e.skintone-1]
  );
});
