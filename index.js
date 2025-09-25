// npm module entry
//
// For path joining
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Provides OpenMoji data in a web developer friendly fashion.
import colorPalette from './data/color-palette.json' with { type: 'json' };
import openmojisRaw from './data/openmoji.json' with { type: 'json' };
import packageJson from './package.json' with { type: 'json' };
const { version } = packageJson;

const __dirname = dirname(fileURLToPath(import.meta.url));

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

export {
  // Colors available
  colorPalette as color_palette,
  // Emoji data objects
  openmojisWithPaths as openmojis,
  // Version to help track bugs
  version
};

