#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const JSDOM = require('jsdom').JSDOM;

const folderSrc = 'color/svg';

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

for (const target of process.argv.slice(2)) {
  generateSvg(
    path.join(folderSrc, path.basename(target)),
    target,
  );
}
