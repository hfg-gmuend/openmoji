OpenMoji API
========

Access OpenMoji emoji images, their metadata, and colors from your Node.js application.

## Install

Install with [npm](https://www.npmjs.com/package/openmoji):

    $ npm install openmoji

## Usage

    > const openmoji = require('openmoji')
    > const om = openmoji.openmojis[0]
    > om.emoji
    '😀'
    > om.hexcode
    '1F600'
    > om.openmoji_tags
    'smile, happy'
    > om.openmoji_images.color.svg
    '/path/to/your/local/openmoji/color/svg/1F600.svg'
    > openmoji.color_palette.colors[23]
    '#186648'
    > openmoji.color_palette.skintones.hair[4]
    '#000000'

## API

### openmoji.openmojis

An array of openmoji emoji data. A openmoji emoji datum has the following structure:

```javascript
{
  emoji: '😀',
  hexcode: '1F600',
  group: 'smileys-emotion',
  subgroups: 'face-smiling',
  annotation: 'grinning face',
  tags: 'face, grin',
  openmoji_tags: 'smile, happy',
  openmoji_author: 'Emily Jäger',
  openmoji_date: '2018-04-18',
  skintone: '',
  skintone_combination: '',
  skintone_base_emoji: '',
  skintone_base_hexcode: '',
  unicode: 1,
  order: 1,
  openmoji_images: {
    black: {
      svg: '/path/to/your/local/openmoji/black/svg/1F600.svg'
    },
    color: {
      svg: '/path/to/your/local/openmoji/color/svg/1F600.svg'
    }
  }
}
```

The paths under `openmoji_images` are absolute paths to image files located inside the `openmoji` package.

### openmoji.color_palette

Colors and skintones allowed in the emojis.

```javascript
{
  colors: <an array of color strings>
  skintones: {
    fitzpatric: <an array of color strings>,
    shadow: <an array of color strings>,
    hair: <an array of color strings>
  }
}
```

where an array of color strings is structurally similar to:

```javascript
[ '#debb90', '#c19a65', '#a57939', '#6a462f', '#352318' ]
```

### openmoji.version

The current package version string.
