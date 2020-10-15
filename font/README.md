OpenMoji Fonts
==============

* [OpenMoji-Color.ttf](https://github.com/hfg-gmuend/openmoji/blob/master/font/picosvgz/OpenMoji-Color.ttf) (COLR/CPAL)
* [OpenMoji-Color.ttf](https://github.com/hfg-gmuend/openmoji/blob/master/font/glyf_colr_0/OpenMoji-Color.ttf) (SVG)
* [OpenMoji-Black.ttf](https://github.com/hfg-gmuend/openmoji/blob/master/font/glyf/OpenMoji-Black.ttf) (black glyphs only)


💁‍♂️ The OpenMoji color fonts are produced in two formats:
- [SVG in Open Type](https://docs.microsoft.com/en-gb/typography/opentype/spec/svg) standard, which allows to embed complete SVG files within a font enabling full color.
- [COLR/CPAL in Open Type](https://docs.microsoft.com/en-us/typography/opentype/spec/colr), which is more limited but more similar to traditional font formats.

⚠️ The SVG OpenMoji font works in all operating systems, but will currently only show color glyphs in Mozilla Firefox and Adobe CC. This is not a limitation of the generated fonts, but of the operating systems and applications.  Other users will probably have better success with the COLR font.

🙏 The fonts are generated with [nanoemoji](https://github.com/googlefonts/nanoemoji) from Google Fonts.

Developer
---------

If you are adventurous and you would like to generate the fonts on your own, here is how:

### Setup

1. Install [node.js](https://nodejs.org) (see version in file [`.nvmrc`](https://github.com/hfg-gmuend/openmoji/blob/master/.nvmrc#L1))
2. Install [Docker](https://www.docker.com/) (tested with Docker 2.2.0.0, engine 19.03.5) or [Podman](https://podman.io/).

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

You can change the parameters of the OpenMoji fonts via the config file `OpenMoji-Color.ttx`.
