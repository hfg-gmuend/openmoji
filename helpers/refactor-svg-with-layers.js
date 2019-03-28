const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chroma = require('chroma-js');
const JSDOM = require('jsdom').JSDOM;

const folderIn = './_tmp/2-svg-color-palette-fixed';
const folderOut = './_tmp/3-svg-refactored-with-layers';
const templateFile = './guidelines/openmoji-template.svg';


const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const refactorSvg = (srcFilePath, destFilePath, templateFile, emoji) => {
  const hasSkintone = (emoji.hexcode == emoji.skintone_base_hexcode);
  const template = (new JSDOM(fs.readFileSync(templateFile, 'utf8'))).window.document;
  const colorLayer = template.getElementById('color');
  const skinLayer = template.getElementById('skin');
  const lineLayer = template.getElementById('line');
  const doc = (new JSDOM(fs.readFileSync(srcFilePath, 'utf8'))).window.document;
  const elements = doc.querySelectorAll('path, circle, polyline, ellipse, polygon, line, rect');
  // const maskElements = doc.querySelectorAll('defs, use, clipPath');
  //
  // maskElements.forEach(element => {
  //   const clone = element.cloneNode(true);
  //   colorLayer.appendChild(clone);
  // });

  elements.forEach((element, i) => {
    const clone = element.cloneNode(true);
    // get attribute values and normalize if attribute is missing
    let fill = clone.getAttribute('fill');
    if (fill) {
      fill = clone.getAttribute('fill').toLowerCase()
    } else {
      fill = '#000000';
      clone.setAttribute('fill', '#000000');
    }
    let stroke = clone.getAttribute('stroke');
    if (stroke) {
      stroke = clone.getAttribute('stroke').toLowerCase()
    } else {
      stroke = 'none';
      clone.setAttribute('stroke', 'none');
    }

    // RULES:
    // black stroke -> line layer
    if (stroke === '#000000' || fill === '#000000') {
      let copyFillOnly = clone.cloneNode(true);
      // special case: black stroke AND color fill
      // if fill is not black, seperate stroke and fill into two elements
      if (stroke === '#000000' && (fill !== '#000000' && fill !== 'none')) {
        clone.setAttribute('fill', 'none');
      }
      lineLayer.appendChild(clone);
      if (stroke === '#000000' && (fill !== '#000000' && fill !== 'none')) {
        copyFillOnly.setAttribute('stroke', 'none');
        colorLayer.appendChild(copyFillOnly);
      }
    }
    // non black shapes -> color layer
    else {
      // special case: emojis with skintone
      if (hasSkintone && fill === '#fcea2b') {
        skinLayer.appendChild(clone);
      } else {
        colorLayer.appendChild(clone);
      }
    }
  });

  writeSvg(destFilePath, template.querySelector('svg').outerHTML);
}


let emojis = require('../data/openmoji.json');
console.log('Loaded emoijs: ' + emojis.length);
emojis = _.filter(emojis, (e) => { return e.skintone == ''});

emojis.forEach(e => {
  // console.log(e.hexcode);
  refactorSvg(
    path.join(folderIn, e.hexcode + '.svg'),
    path.join(folderOut, e.group, e.subgroups, e.hexcode + '.svg'),
    templateFile,
    e
  );
});

console.log('✅', emojis.length);
