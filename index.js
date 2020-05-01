const version = require('./package.json').version
const openmojisRaw = require('./data/openmoji.json')
const colorPalette = require('./data/color-palette.json')
// For path joining
const path = require('path')
// Path to SVG directories
// TODO expose svg files under src/:group/:subgroups?
const baseBlackDir = path.join(__dirname, 'black')
const baseColorDir = path.join(__dirname, 'color')

// Enrich the emoji data objects.
const openmojisWithPaths = openmojisRaw.map(moji => {
  return Object.assign({}, moji, {
    // The absolute file path to SVG file
    openmoji_images: {
      black: {
        svg: path.join(baseBlackDir, 'svg', moji.hexcode + '.svg')
      },
      color: {
        svg: path.join(baseColorDir, 'svg', moji.hexcode + '.svg')
      }
    }
  })
})

exports.version = version
exports.openmojis = openmojisWithPaths
exports.color_palette = colorPalette
