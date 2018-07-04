const fs = require('fs');
var JSDOM = require('jsdom').JSDOM;

const fitzpatrick = ['#FADCBC', '#E0BB95', '#BF8F68', '#9B643D', '#594539'];

const writeSvg = (filePath, data) => {
  const head = '<!--?xml version="1.0" encoding="utf-8"?-->' + '\n';
  fs.writeFileSync(filePath, head + data);
}

const dom = new JSDOM(fs.readFileSync('./color/svg/1F60A.svg', 'utf8'));
const doc = dom.window.document;

const fillSkins = doc.querySelectorAll('[fill*="#FCEA2B" i]');
fitzpatrick.forEach((skintone, i) => {
  fillSkins.forEach(s => {
    s.setAttribute('fill', skintone);
  });
  writeSvg('/Users/bene/Desktop/1F60A_skin_'+i+'.svg', doc.querySelector('svg').outerHTML);
});
