#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import lodash from 'lodash';
import chroma from 'chroma-js';
import kdTreeModule from 'kd-tree-javascript';
import jsdom from 'jsdom';

const _ = lodash;
const { kdTree: KDTree } = kdTreeModule;
const { JSDOM } = jsdom;


const hexToRGB = (hex) => {
  const rgb = chroma(hex).rgb();
  return {r: rgb[0], g: rgb[1], b: rgb[2]};
}

const rgbToHex = (rgb) => {
  return chroma(rgb.r, rgb.g, rgb.b).hex();
}

let colorPalette = JSON.parse(readFileSync(new URL('../data/color-palette.json', import.meta.url), 'utf8')).colors;
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
  writeFileSync(filePath, data);
}

const forceColors = (srcFilePath, destFilePath, colorPalette) => {
  const dom = new JSDOM(readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelectorAll(':not(#grid) > [fill], :not(#grid) > [stroke]');
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
    console.log('wrong colors -> ', srcFilePath);
    writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
  }
}


let emojis = JSON.parse(readFileSync(new URL('../data/openmoji.json', import.meta.url), 'utf8'));
console.log('Loaded emoijs: ' + emojis.length);
emojis = _.filter(emojis, (e) => { return e.skintone == ''});
// exclude the "Emoji Modifier Fitzpatrick"
emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FB'});
emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FC'});
emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FD'});
emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FE'});
emojis = _.filter(emojis, (e) => { return e.hexcode !== '1F3FF'});
console.log('Emoijs without skintones: ' + emojis.length);

emojis.forEach(emoji => {
  const svgFile = join('./src', emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
  forceColors(svgFile, svgFile, colorPalette);
});

console.log('✅', emojis.length);
