#!/usr/bin/env node
import { basename, dirname, join, normalize, resolve, sep } from 'node:path';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import globModule from 'glob';
import lodash from 'lodash';
import { createRequire } from 'node:module';

const glob = globModule.sync;
var argv = process.argv.slice(2);
const _ = lodash;

const require = createRequire(import.meta.url);
const emojibaseData = require('emojibase-data/en/data.json');
const emojibaseGroups = require('emojibase-data/meta/groups.json');
const groups = emojibaseGroups.groups;
const subgroups = emojibaseGroups.subgroups;

const emojis = _.map(emojibaseData, e => {
  e.group = groups[e.group];
  e.subgroups = subgroups[e.subgroup];
  return e
});

if(!argv[0]) {
  help();
  process.exit(1);
}


function help() {
  console.log('usage: node import-svg-to-src-folder.js <folder with svg files for importing to src folder>');
};

// recursive directory creation
// https://gist.github.com/bpedro/742162#gistcomment-2606935
const mkdirp = dir => resolve(dir)
  .split(sep)
  .reduce((acc, cur) => {
    const currentPath = normalize(acc + sep + cur);
    try {
      statSync(currentPath);
    } catch (e) {
      if (e.code === 'ENOENT') {
        mkdirSync(currentPath);
      } else {
        throw e;
      }
    }
    return currentPath;
  }, '');


let results = [];
const svgFiles = glob(join(argv[0], '*.svg'));
console.log(`Found ${svgFiles.length} svg files in ${argv[0]}`);
let importedCounter = 0;

svgFiles.forEach((f, i) => {
  let importResult = ''; // NEW, OVERWRITE or ERROR
  let emojiChar = '';
  const fileBasename = basename(f, '.svg');
  const foldername = _.last(dirname(f).split('/'));
  const emoji = _.find(emojis, { 'hexcode': fileBasename });

  if (emoji) {
    emojiChar = emoji.emoji;
    const destinationFolder = join('src', emoji.group, emoji.subgroups);
    mkdirp(destinationFolder); // generate missing folders recursively
    const destinationSvg = join(destinationFolder, fileBasename+'.svg');
    if (existsSync(destinationSvg)) importResult = 'OVERWRITE';
    else importResult = 'NEW';
    copyFileSync(f, destinationSvg);
    importedCounter++;
  } else {
    importResult = 'ERROR';
  }

  let dt = new Date();
  dt = dt.getFullYear() +'-'+ ('0' + (dt.getMonth()+1)).slice(-2) +'-'+ ('0' + dt.getDate()).slice(-2);
  results.push([emojiChar, fileBasename, '', foldername, dt, importResult]);
});

results.forEach(line => {
  console.log(line.join('\t'));
});

console.log(`Done! Imported ${importedCounter} svg files to src folder`);
