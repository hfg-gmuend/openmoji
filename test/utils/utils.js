const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const libxmljs = require("libxmljs");

const argv = require('optimist').default('openmoji-src-folder', './src').argv;
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

function isValidXML(string) {
  try {
    libxmljs.parseXml(string);
  } catch (error) {
    console.error(error.message);
    return false;
  }
  return true;
};

module.exports.createDoc = createDoc;
module.exports.readSVG = readSVG;
module.exports.getSrcFilepath = getSrcFilepath;
module.exports.isValidXML = isValidXML;
