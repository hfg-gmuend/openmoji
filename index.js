// npm module entry
//
// Provides OpenMoji data in a web developer friendly fashion.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = dirname(fileURLToPath(import.meta.url));
const loadJson = filePath => JSON.parse(readFileSync(filePath, 'utf8'));

const version = loadJson(join(packageDirectory, 'package.json')).version;
const openmojisRaw = loadJson(join(packageDirectory, 'data/openmoji.json'));
const colorPalette = loadJson(join(packageDirectory, 'data/color-palette.json'));
// Path to SVG directories
// TODO expose svg files under src/:group/:subgroups?
const baseBlackDir = join(packageDirectory, 'black');
const baseColorDir = join(packageDirectory, 'color');

// Enrich the emoji data objects with image file paths.
const openmojis = openmojisRaw.map(om => Object.assign({}, om, {
  // The absolute file paths to SVG files
  openmoji_images: {
    black: {
      svg: join(baseBlackDir, 'svg', om.hexcode + '.svg')
    },
    color: {
      svg: join(baseColorDir, 'svg', om.hexcode + '.svg')
    }
  }
}));

export { version, openmojis, colorPalette as color_palette };
export default { version, openmojis, color_palette: colorPalette };
