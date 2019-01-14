const glob = require('glob').sync;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const beautify = require('js-beautify').html;
const JSDOM = require('jsdom').JSDOM;

let colorEmojiPaths = glob('./color/svg/*.svg');
const folderOut = './black/svg';
// const folderOut = './color/svg-color-fill';

const writeSvg = (filePath, data) => {
  const content = beautify(data, { indent_size: 2, max_preserve_newlines: "-1" });
  fs.writeFileSync(filePath, content);
}

const generateSvg = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelectorAll('svg > g:not(#line)');
  // const query = doc.querySelectorAll('#line, #grid');
  query.forEach(el => { el.remove() });
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

console.log('Loaded emoijs: ' + colorEmojiPaths.length);
// colorEmojiPaths = [colorEmojiPaths[0]];

colorEmojiPaths.forEach(f => {
  generateSvg(
    f,
    path.join(folderOut, path.basename(f))
  );
});

console.log('✅', colorEmojiPaths.length);
