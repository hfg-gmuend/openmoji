import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import jsdom from 'jsdom';
import libxmljs from 'libxmljs';
import optimist from 'optimist';

const { JSDOM } = jsdom;
const argv = optimist.default('openmoji-src-folder', './src').argv;
const openmojiSrcFolder = argv['openmoji-src-folder'];

export function createDoc(emoji) {
  const svgFile = join(openmojiSrcFolder, emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
  const dom = new JSDOM(readFileSync(svgFile), 'utf8');
  return dom.window.document;
}

export function readSVG(emoji) {
    const svgFile = join(openmojiSrcFolder, emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
    var str = readFileSync(svgFile, "utf8");
    return str;
}

export function getSrcFilepath(emoji) {
  return join(openmojiSrcFolder, emoji.group, emoji.subgroups, emoji.hexcode + '.svg');
}

export function isValidXML(string) {
  try {
    libxmljs.parseXml(string);
  } catch (error) {
    console.error(error.message);
    return false;
  }
  return true;
}
