# OpenMoji Fonts

This directory contains the fonts generated from the OpenMoji Black and OpenMoji Color glyphs in the `/src` directory.

Note that a single standard format for color fonts has not yet emerged, though it currently looks like the dominant color font format will be COLRv1/CPAL in OpenType (commonly referred to as `COLRv1` or `colr_1`).

[Most browsers support COLRv1](https://caniuse.com/colr-v1) at this stage, though [COLRv0 has even wider support](https://caniuse.com/colr) (though with less features).

Desktop applications are are less likely to support `COLR` formats at this stage, though this will hopefully change in the future.

## Understanding the directory

We currently offer a monochrome font (OpenMojiBlack) in a single format (Glyf in OpenType, optionally woff2 compressed).

We offer a color font (OpenMojiColor) in a variety of formats and it is up to the user to decide which format is most appropriate for their use-case. See [section below](#color-font-formats).

### `.ttf` vs `.woff2`

Put simply:
- For a desktop application, use the `.ttf` file
- For a website application, use the `.woff2` file

### Color font formats

The monochrome font (OpenMojiBlack) comes in only a single format, which is widely supported. It can be found in the `OpenMoji-black-glyf` directory.

The color font comes in a variety of formats:

| Directory                                    | Format | Description                             | Bitmap/Vector | Use-case                                  |
| -------------------------------------------- | ------ | --------------------------------------- | ------------- | ----------------------------------------- |
| [`OpenMoji-color-cbdt`](OpenMoji-color-cbdt) | `CBDT` | Early format that is largely deprecated | Bitmap        | Android applications, Old Chrome browsers |
| [`OpenMoji-color-glyf_colr_0`](OpenMoji-color-glyf_colr_0) | `COLRv0` in OpenType | Standardised format that is superceded by `COLRv1`, limited features | Vector        | Almost all modern webbrowsers, very little support on desktop applications |
| [`OpenMoji-color-glyf_colr_1`](OpenMoji-color-glyf_colr_1) | `COLRv1` in OpenType | Emerging standard with many features | Vector        | Most modern browsers (not Safari), very little support on desktop applications |
| [`OpenMoji-color-picosvgz`](OpenMoji-color-picosvgz) | `SVG` in OpenType | SVG-based format with compression tricks applied using `picosvg` | Vector        | Firefox and Safari, some desktop applications |
| [`OpenMoji-color-sbix`](OpenMoji-color-sbix) | `SBIX` | Format primarily used by Apple | Bitmap        | Safari, Chrome-based browsers, some desktop applications, MacOS, iOS |
| [`OpenMoji-color-untouchedsvgz`](OpenMoji-color-untouchedsvgz) | `SVG` in OpenType | `SVG`-based format without compression tricks | Vector        | Firefox and Safari, some desktop applications |
| [`OpenMoji-color-colr0_svg`](OpenMoji-color-colr0_svg) | `SVG` in OpenType, `COLRv0` | Both `SVG` and `COLRv0` in one font | Vector        | All modern webbrowsers, some desktop applications |
| [`OpenMoji-color-colr1_svg`](OpenMoji-color-colr1_svg) | `SVG` in OpenType, `COLRv0` | Both `SVG` and `COLRv1` in one font | Vector        | Almost all modern webbrowsers, some desktop applications |

We generally recommend:
- `COLRv0` with `woff2` for websites
- `COLRv1` with `woff2` for websites if lack of support for Safari is okay
- `SVG`+`COLRv0` with `ttf` for desktop applications, though you may want to try bitmap-based formats if this does not work.

## Further reading

- [CanIUse COLRv0/CPAL](https://caniuse.com/colr)
- [CanIUse COLRv1/CPAL](https://caniuse.com/colr-v1)
- [ColorfontsWTF](https://www.colorfonts.wtf/)

## Building the fonts

The fonts are built using Google's `nanoemoji` toolchain.

Building all 7 fonts from scratch takes a long time (several hours), but benefits from caching for future runs.

### Running the font builder

Generally users are not expected to ever want to run the font builder themselves.
Adventurous users and developers can follow the guide below for instructions on how to generate the font files.

On a Unix system (Linux, Mac, WSL2), run [`helpers/generate-fonts.sh`](../helpers/generate-fonts.sh).

You need to have the following installed:
- [Docker](https://www.docker.com/) or [Podman](https://podman.io/)

1. Prerequisites
   1. Be on a Unix system (Linux, Mac, WSL2, BSD, …)
   2. Have [Docker](https://www.docker.com/) or [Podman](https://podman.io/) installed
2. Open a terminal and go to the OpenMoji folder
   - `cd path/to/openmoji`
3. Run the font builder
   - `./helpers/generate-fonts.sh`
   - Wait for build to finish. This can take a few hours for the initial run. Be patient!
4. Done ✅

### Changing font parameters

Font parameters can be changed in the [`OpenMoji-color.ttx` file in the `data` folder](../data/OpenMoji-Color.ttx)
