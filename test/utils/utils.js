import fs from 'fs';
import { JSDOM } from 'jsdom';
import libxmljs from 'libxmljs';
import path from 'path';
import parser from 'yargs-parser';

const argv = parser('openmoji-src-folder', {
  default: {
    'openmoji-src-folder': './src'
  }
});

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

export {
  createDoc, getSrcFilepath,
  isValidXML, readSVG
};

