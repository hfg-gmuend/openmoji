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

const generateSkintoneSvg = (srcFilePath, destFilePath, skintoneIndex) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const skinFills = doc.querySelectorAll('[fill*="#FCEA2B" i]');
  // const skinShadowFills = doc.querySelectorAll('[fill*="#F1B31C" i]');
  // if (skinFills.length === 0) console.error('Error: No skintone defined in ' + srcFilePath);
  skinFills.forEach(s => {
    s.setAttribute('fill', fitzpatrick[skintoneIndex]);
  });
  // skinShadowFills.forEach(s => {
  //   const col = skintoneIndex < fitzpatrick.length - 1 ?  fitzpatrick[skintoneIndex+1] :  _.last(fitzpatrick);
  //   s.setAttribute('fill', col);
  // });
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

let emojis = require('../data/openmoji.json');
console.log('Loaded emoijs: ' + emojis.length);
// TODO: Check is this correct?
emojis = _.filter(emojis, (e) => { return e.skintone_base_emoji !== '' && e.skintone_base_emoji !== e.emoji });

emojis.forEach(e => {
  generateSkintoneSvg(
    path.join(folderIn, e.skintone_base_hexcode + '.svg'),
    path.join(folderOut, e.hexcode + '.svg'),
    e.skintone - 1 // fitzpatrick starts with 1 and not like an array with 0
  );
});

console.log('Generated emoijs skintones variants: ' + emojis.length);
