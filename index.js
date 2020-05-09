// npm module entry
//
// Provides OpenMoji data in a web developer friendly fashion.
//
const version = require('./package.json').version;
const openmojisRaw = require('./data/openmoji.json');
const colorPalette = require('./data/color-palette.json');
// For path joining
const path = require('path');
// Path to SVG directories
// TODO expose svg files under src/:group/:subgroups?
const baseBlackDir = path.join(__dirname, 'black');
const baseColorDir = path.join(__dirname, 'color');

// Enrich the emoji data objects with image file paths.
const openmojisWithPaths = openmojisRaw.map(om => {
  return Object.assign({}, om, {
    // The absolute file paths to SVG files
    openmoji_images: {
      black: {
        svg: path.join(baseBlackDir, 'svg', om.hexcode + '.svg')
      },
      color: {
        svg: path.join(baseColorDir, 'svg', om.hexcode + '.svg')
      }
    }
  });
});

// Version to help track bugs
exports.version = version;
// Emoji data objects
exports.openmojis = openmojisWithPaths;
// Colors available
exports.color_palette = colorPalette;
