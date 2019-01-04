const path = require('path');
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;

const glob = require('glob').sync;
var argv = process.argv.slice(2);
const _ = require('lodash');

const emojibaseData = require('emojibase-data/en/data.json');
const emojibaseGroups = require('emojibase-data/meta/groups.json');
const groups = emojibaseGroups.groups;
const subgroups = emojibaseGroups.subgroups;


if(!argv[0]) {
  help();
  process.exit(1);
}

const emojis = _.map(emojibaseData, e => {
  return {
    emoji: e.emoji,
    hexcode: e.hexcode,
    group: groups[e.group],
    subgroups: subgroups[e.subgroup]
  };
});

let results = [];
const svgFiles = glob( path.join(argv[0], '*.svg') );
svgFiles.forEach((f, i) => {
  const basename = path.basename(f, '.svg');
  const foldername = _.last(path.dirname(f).split('/'));
  const emoji = _.find(emojis, { 'hexcode': basename });
  if (!emoji) {
    throw Error ('Cannot find Unicode definition for '+f);
  }

  const destination = path.join('src', emoji.group, emoji.subgroups, basename+'.svg')
  fs.copyFileSync(f, destination, COPYFILE_EXCL);
  console.log(basename+'.svg', '->', destination);

  let dt = new Date();
  dt = dt.getFullYear() +'-'+ ('0' + (dt.getMonth()+1)).slice(-2) +'-'+ ('0' + dt.getDate()).slice(-2);
  results.push([emoji.emoji, basename, '', foldername, dt]);
});

results.forEach(line => {
  console.log(line.join('\t'));
});

function help() {
	console.log('usage: node import-svg-to-src-folder.js <folder with svg files for importing to src folder>');
};
