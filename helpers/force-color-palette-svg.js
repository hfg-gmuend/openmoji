const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chroma = require('chroma-js');
const KDTree = require('kd-tree-javascript').kdTree;
const JSDOM = require('jsdom').JSDOM;

const folderIn = './_tmp/1-svg-src-4-decimals';
const folderOut = './_tmp/2-svg-color-palette-fixed';


const hexToRGB = (hex) => {
  const rgb = chroma(hex).rgb();
  return {r: rgb[0], g: rgb[1], b: rgb[2]};
}

const rgbToHex = (rgb) => {
  return chroma(rgb.r, rgb.g, rgb.b).hex();
}

let colorPalette = require('../data/color-palette.json').colors;
colorPalette = colorPalette.map(c => {
  return hexToRGB(c);
});

// setup kdTree to find neareast color in a speedy way
const tree = new KDTree(
  colorPalette,
  (a, b) => { return Math.pow( Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2), 0.5); },
  ["r", "g", "b"]
);

const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const forceColors = (srcFilePath, destFilePath, colorPalette) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelectorAll('[fill], [stroke]');
  let modified = false;
  query.forEach(s => {
    const fill = s.getAttribute('fill');
    if (fill && fill !== 'none') {
      const neareastColor = tree.nearest(hexToRGB(fill), 1)[0][0];
      const distance = tree.nearest(hexToRGB(fill), 1)[0][1];
      if (distance > 0) {
        s.setAttribute('fill', rgbToHex(neareastColor));
        // s.setAttribute('fill', chroma('hotpink').hex());
        modified = true;
      }
    }
    const stroke = s.getAttribute('stroke');
    if (stroke && stroke !== 'none') {
      const neareastColor = tree.nearest(hexToRGB(stroke), 1)[0][0];
      const distance = tree.nearest(hexToRGB(stroke), 1)[0][1];
      if (distance > 0) {
        s.setAttribute('stroke', rgbToHex(neareastColor));
        // s.setAttribute('stroke', chroma('hotpink').hex());
        modified = true;
      }
    }
  });
  if (modified) {
    console.log('modified -> ', srcFilePath);
  } else {
    console.log(srcFilePath);
  }
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}


let emojis = require('../data/openmoji.json');
console.log('Loaded emoijs: ' + emojis.length);

emojis = _.filter(emojis, (e) => { return e.skintone == ''});

emojis.forEach(e => {
  forceColors(
    path.join(folderIn, e.hexcode + '.svg'),
    path.join(folderOut, e.hexcode + '.svg'),
    colorPalette
  );
});

console.log('✅', emojis.length);
