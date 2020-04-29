#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const JSDOM = require('jsdom').JSDOM;

const folderSrc = './src';
const folderOut = './color/svg';

const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const generateSvg = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelector('#grid');
  if (query) query.remove();
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

// Construct an index of emojis by target path for fast lookup.
const emojis = require('../../data/openmoji.json');
const emojisByTarget = {};
for (const e of emojis) {
  const target = path.join(folderOut, e.hexcode + '.svg');
  emojisByTarget[target] = e;
}

for (const target of process.argv.slice(2)) {
  const e = emojisByTarget[target];
  // console.log(e.hexcode);
  generateSvg(
    path.join(folderSrc, e.group, e.subgroups, e.hexcode + '.svg'),
    target,
  );
}
