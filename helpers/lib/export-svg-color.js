#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

const folderSrc = './src';
const folderOut = './color/svg';

const writeSvg = (filePath, data) => {
  writeFileSync(filePath, data);
}

const generateSvg = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelector('#grid');
  if (query) query.remove();
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

// Construct an index of emojis by target path for fast lookup.
const emojis = JSON.parse(readFileSync(new URL('../../data/openmoji.json', import.meta.url), 'utf8'));
const emojisByTarget = {};
for (const e of emojis) {
  const target = join(folderOut, e.hexcode + '.svg');
  emojisByTarget[target] = e;
}

for (const target of process.argv.slice(2)) {
  const e = emojisByTarget[target];
  // console.log(e.hexcode);
  generateSvg(
    join(folderSrc, e.group, e.subgroups, e.hexcode + '.svg'),
    target,
  );
}
