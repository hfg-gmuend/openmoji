OpenMoji Helpers Scripts
========================

This folder `helpers/` Contains various helper scripts e.g. to export to .png and .svg, generate skintones variants, enforce the OpenMoji color palette etc



## Big helpers

- `npm run generate` generate everything
- `npm run generate-fonts` generate the OpenMoji fonts



## Little helpers

- `clean.sh` cleans up the build directories
- `npm run cache-clear` / `npm run cc` clears build system cache
- `npm run export-emojipedia` export all OpenMojis to 512x512 png files for listing at Emojipedia
- `npm run export-openmoji-ios` copies and updates all assets in the openmoji-ios repository
- `npm run export-pdf` export all OpenMojis to pdf files
- `npm run export-png` export all OpenMojis to 72x72 and 618x618 png files
- `npm run export-svg` export all OpenMojis to svg files
- `npm run export-zip` export zip packages for release
- `find-emojis.js` sub script used by generate.sh
- `force-color-palette-svg.js` helper to force the OpenMoji colors for all svg files in the src folder
- `npm run generate-data-tables` generate files in data folder eg. openmoji.json
- `generate-font-css.js` generate css file to be used with OpenMoji fonts
- `generate-font-glyphs.js` copy all svg glyph files to font folder in preparation for font generator
- `npm run lint-sh` lint all bash script in the helpers folder
- `npm run pretty-src-svg` pretty all svg files in the src folder
- `generate-index-html.js` generate overview grid index.html
- `generate-index-list-html.js` generate overview list index-list.html
- `import-svg-to-src-folder.js` import new OpenMojis to src folder
- `prettyfy-figma-svg.js` prettfy svg files exported by [Figma](https://www.figma.com/)
- `npm run show-extras-hexcodes` shows an overview of private use hexcodes of the openmoji-extras



## Additional Dependencies

Some of the helper scripts have additional dependencies, which are not cover by `npm install`:

**librsvg**
- `brew install librsvg` (macOS)
- `apt-get install librsvg2-bin` (ubuntu)

**pngquant**
- `brew install pngquant` (macOS)
- `apt-get install pngquant` (ubuntu)

**shellcheck**

- `brew install shellcheck` (macOS)



## License

Code licensed under the GNU Lesser General Public License v3 ([LGPL-3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html))

[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL%20v3-lightgrey.svg)](https://www.gnu.org/licenses/lgpl-3.0.en.html)
