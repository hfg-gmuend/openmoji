const path = require('path');
const fs = require('fs');

const glob = require('glob').sync;
var argv = process.argv.slice(2);
const _ = require('lodash');

const emojis = require('../data/openmoji-emoji11.json');


if(!argv[0]) {
  help();
  process.exit(1);
}

let results = [];
const svgFiles = glob( path.join(argv[0], '*.svg') );
svgFiles.forEach((f, i) => {
  let importResult = ''; // NEW, OVERWRITE or ERROR
  let emojiChar = '';
  const basename = path.basename(f, '.svg');
  const foldername = _.last(path.dirname(f).split('/'));
  const emoji = _.find(emojis, { 'hexcode': basename });

  if (emoji) {
    emojiChar = emoji.emoji;
    const destination = path.join('src', emoji.group, emoji.subgroups, basename+'.svg');
    if (fs.existsSync(destination)) importResult = 'OVERWRITE';
    else importResult = 'NEW';
    fs.copyFileSync(f, destination);
  } else {
    importResult = 'ERROR';
  }

  let dt = new Date();
  dt = dt.getFullYear() +'-'+ ('0' + (dt.getMonth()+1)).slice(-2) +'-'+ ('0' + dt.getDate()).slice(-2);
  results.push([emojiChar, basename, '', foldername, dt, importResult]);
});

results.forEach(line => {
  console.log(line.join('\t'));
});

function help() {
	console.log('usage: node import-svg-to-src-folder.js <folder with svg files for importing to src folder>');
};
