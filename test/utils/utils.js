const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const argv = require('optimist').demand('openmoji-src-folder').argv;
const openmojiSrcFolder = argv['openmoji-src-folder'];


function createDoc(emoji) {
  const svgFile = path.join(openmojiSrcFolder, emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
  const dom = new JSDOM(fs.readFileSync(svgFile), 'utf8');
  return dom.window.document;
}

function readSVG(emoji) {
    const svgFile = path.join(openmojiSrcFolder, emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
    var str = fs.readFileSync(svgFile, "utf8");
    return str;
}

function getSrcFilepath(emoji) {
  return path.join(openmojiSrcFolder, emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
}

module.exports.createDoc = createDoc;
module.exports.readSVG = readSVG;
module.exports.getSrcFilepath = getSrcFilepath;