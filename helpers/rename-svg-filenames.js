const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const csvParse = require('csv-parse/lib/sync');


// -- helper functions --
const loadCsv = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return csvParse(content, {columns: true});
}

const emojis = loadCsv('./_tmp/refactor-hfg-extras/OpenMoji Extras Refactoring - openmoji-gdoc.csv');

_.each(emojis, e => {
  const oldFile = path.join('./_tmp/refactor-hfg-extras/hfg', e.subgroups, e.hexcode +'.svg');
  const newFile = path.join('./src/extras-openmoji', e.subgroups_new, e.hexcode_new +'.svg');
  console.log(oldFile, newFile);
  fs.copyFileSync(oldFile, newFile);
});
