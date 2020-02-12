OpenMoji Fonts
==============

* [OpenMoji-Color.ttf](https://github.com/hfg-gmuend/openmoji/blob/master/font/OpenMoji-Color.ttf)
* [OpenMoji-Black.ttf](https://github.com/hfg-gmuend/openmoji/blob/master/font/OpenMoji-Black.ttf) (black glyphs only)

⚠️ The OpenMoji fonts work in all operating systems, but will currently only show color glyphs in Mozilla Firefox and Adobe CC. This is not a limitation of the generated fonts, but of the operating systems and applications.

💁‍♂️ The OpenMoji fonts are based on the [SVG in Open Type](https://www.w3.org/2013/10/SVG_in_OpenType/) standard, which allows to embed complete SVG files within a font enabling full color.

🙏 The fonts are generated with the [SVGinOT Color Font Builder](https://github.com/13rac1/scfbuild) by Brad Erickson. Many thanks for open sourcing this tool and the help!

Developer
---------

If you are adventurous and you would like to generate the fonts on your own, here is how:

### Setup

1. Install [node.js](https://nodejs.org) (see version in file [`.nvmrc`](https://github.com/hfg-gmuend/openmoji/blob/master/.nvmrc#L1))
2. Install [Docker](https://www.docker.com/) (tested with Docker 2.2.0.0, engine 19.03.5)
3. Download or clone our [scfbuild](https://github.com/b-g/scfbuild) fork
4. Install the [Docker container](https://github.com/b-g/scfbuild#docker) of our scfbuild fork
### Generate Fonts

1. Make sure that Docker is running in background
2. Open Terminal and go to OpenMoij folder 
```bash
cd path/to/openmoji
```
4. Copy the svg production files to the folders `font/tmp-color` and `font/tmp-black` . Please use the script, as it will also take care of special cases like missing glyphs etc.
```bash
node helpers/export-svg-font.js
```
3. Generate the OpenMoji font files
```bash
./helpers/generate-fonts.sh
```

Done! ✅

You can change the parameters of the OpenMoji fonts via the two config files:

- `scfbuild-color.yml`
-  `scfbuild-black.yml` .