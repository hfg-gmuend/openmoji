const glob = require('glob').sync;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const JSDOM = require('jsdom').JSDOM;

let colorEmojiPaths = glob('./color/svg/*.svg');
const folderOut = './black/svg';

const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const generateSvg = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelectorAll('#grid, #color, #color-foreground, #skin, #skin-shadow, #hair');
  query.forEach(el => { el.remove() });
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

if (process.argv.length > 2) {
  // file name passed in
  fileName = process.argv[2]
  filePath = "./color/svg/" + fileName + ".svg"

  console.log('Export Black SVG: ' + fileName);
  
  generateSvg(
    filePath,
    path.join(folderOut, path.basename(filePath))
  );
} else {
  // no arguments
  console.log('Export SVG Black: ' + colorEmojiPaths.length);
  colorEmojiPaths.forEach(f => {
    generateSvg(
      f,
      path.join(folderOut, path.basename(f))
    );
  });
}
  