#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

const folderSrc = 'color/svg';

const writeSvg = (filePath, data) => {
  writeFileSync(filePath, data);
}

const generateSvg = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  const query = doc.querySelectorAll('#grid, #color, #color-foreground, #skin, #skin-shadow, #hair');
  query.forEach(el => { el.remove() });
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

for (const target of process.argv.slice(2)) {
  generateSvg(
    join(folderSrc, basename(target)),
    target,
  );
}
