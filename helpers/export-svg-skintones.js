const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const JSDOM = require('jsdom').JSDOM;

const hairColors = require('../data/color-palette.json').skintones.hair;
const fitzpatrickColors = require('../data/color-palette.json').skintones.fitzpatrick;
const shadowColors = require('../data/color-palette.json').skintones.shadow;
const folderSrc = './src';
const folderOut = './color/svg';

const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const generateSkintoneSvg = (srcFilePath, destFilePath, skintoneIndex) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const hairFills = doc.querySelectorAll('#hair [fill]');
  hairFills.forEach(s => {
    s.setAttribute('fill', hairColors[skintoneIndex]);
  });
  const skinFills = doc.querySelectorAll('#skin [fill]');
  skinFills.forEach(s => {
    s.setAttribute('fill', fitzpatrickColors[skintoneIndex]);
  });
  const skinStrokes = doc.querySelectorAll('#skin [stroke]');
  skinStrokes.forEach(s => {
    s.setAttribute('stroke', fitzpatrickColors[skintoneIndex]);
  });
  const skinShadowFills = doc.querySelectorAll('#skin-shadow [fill]');
  skinShadowFills.forEach(s => {
    s.setAttribute('fill', shadowColors[skintoneIndex]);
  });
  doc.querySelector('#grid').remove();
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

const srcEmojis = require('../data/openmoji.json');
let emojis = require('../data/openmoji.json');
emojis = _.filter(emojis, (e) => { return e.skintone !== '' });
console.log('Export SVG Skintones: ' + emojis.length);

emojis.forEach(e => {
  const skintoneBaseEmoji = _.find(srcEmojis, {'hexcode': e.skintone_base_hexcode});
  // console.log(e.hexcode, e.skintone_base_hexcode);
  generateSkintoneSvg(
    path.join(folderSrc, skintoneBaseEmoji.group, skintoneBaseEmoji.subgroups, skintoneBaseEmoji.hexcode + '.svg'),
    path.join(folderOut, e.hexcode + '.svg'),
    e.skintone - 1 // fitzpatrick starts with 1 and not like an array with 0
  );
});

console.log('✅', emojis.length);
