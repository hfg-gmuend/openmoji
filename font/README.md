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
2. Install [Docker](https://www.docker.com/)
3. Install Docker container
```bash
cd openmoji/font/
docker build -t openmoji-font .
```

### Generate Fonts

1. Copy the svg files to the folders "tmp-color" and "tmp-black"
```bash
cd openmoji/
node helpers/export-svg-font.js
```
2. Make sure that Docker is running
3. Start Docker container
```bash
cd openmoji/font/
docker run --interactive --tty --rm --volume $PWD:/wd --workdir /wd openmoji-font:latest bash
```
4. Generate font files
```bash
scfbuild/bin/scfbuild -c scfbuild-color.yml
```

The file `scfbuild-color.yml` holds for instance all the settings for the OpenMoji color font.