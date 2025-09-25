#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import _glob from 'glob';
var argv = process.argv.slice(2);
import _ from 'lodash';

const { sync: glob } = _glob;
import emojibaseData from 'emojibase-data/en/data.json' with { type: 'json' };;
import emojibaseGroups from 'emojibase-data/meta/groups.json' with { type: 'json' };;
const { groups, subgroups } = emojibaseGroups;

const emojis = _.map(emojibaseData, e => {
  e.group = groups[e.group];
  e.subgroups = subgroups[e.subgroup];
  return e
});

if (!argv[0]) {
  help();
  process.exit(1);
}


function help() {
  console.log('usage: node import-svg-to-src-folder.js <folder with svg files for importing to src folder>');
};

// recursive directory creation
// https://gist.github.com/bpedro/742162#gistcomment-2606935
const mkdirp = dir => path
  .resolve(dir)
  .split(path.sep)
  .reduce((acc, cur) => {
    const currentPath = path.normalize(acc + path.sep + cur);
    try {
      fs.statSync(currentPath);
    } catch (e) {
      if (e.code === 'ENOENT') {
        fs.mkdirSync(currentPath);
      } else {
        throw e;
      }
    }
    return currentPath;
  }, '');


let results = [];
const svgFiles = glob(path.join(argv[0], '*.svg'));
console.log(`Found ${svgFiles.length} svg files in ${argv[0]}`);
let importedCounter = 0;

svgFiles.forEach((f, i) => {
  let importResult = ''; // NEW, OVERWRITE or ERROR
  let emojiChar = '';
  const basename = path.basename(f, '.svg');
  const foldername = _.last(path.dirname(f).split('/'));
  const emoji = _.find(emojis, { 'hexcode': basename });

  if (emoji) {
    emojiChar = emoji.emoji;
    const destinationFolder = path.join('src', emoji.group, emoji.subgroups);
    mkdirp(destinationFolder); // generate missing folders recursively
    const destinationSvg = path.join(destinationFolder, basename + '.svg');
    if (fs.existsSync(destinationSvg)) importResult = 'OVERWRITE';
    else importResult = 'NEW';
    fs.copyFileSync(f, destinationSvg);
    importedCounter++;
  } else {
    importResult = 'ERROR';
  }

  let dt = new Date();
  dt = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
  results.push([emojiChar, basename, '', foldername, dt, importResult]);
});

results.forEach(line => {
  console.log(line.join('\t'));
});

console.log(`Done! Imported ${importedCounter} svg files to src folder`);
