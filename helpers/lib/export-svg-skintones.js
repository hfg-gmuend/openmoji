#!/usr/bin/env node

// Used by helpers/export-svg-skintones.sh via helpers/lib/export-svg-skintones.sh
// to project one skintone variation of a base emoji into its corresponding
// composite hexcode SVG file.
// Receives target SVG file paths as arguments.
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

import colorPaletteJson from '../../data/color-palette.json' with { type: 'json' };;
const { skintones } = colorPaletteJson;
const hairColors = skintones.hair;
const fitzpatrickColors = skintones.fitzpatrick;
const shadowColors = skintones.shadow;
const folderSrc = 'src';
const folderOut = 'color/svg';

const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const generateSkintoneSingle = (srcFilePath, destFilePath, skintoneIndex) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  /**
   * Change hair color unless any of the following are specified:
   *   1F471 blond person
   *   1F474 old man
   *   1F475 old woman
   *   1F9B0 red hair component
   *   1F9B3 white hair component
   *   1F9D3 older person
   */
  if (!destFilePath.match(/1F471|1F474|1F475|1F9B0|1F9B3|1F9D3/)) {
    const hairFills = doc.querySelectorAll('#hair [fill]');
    hairFills.forEach(s => {
      s.setAttribute('fill', hairColors[skintoneIndex]);
    });
  }
  const skinFills = doc.querySelectorAll('#skin [fill]');
  skinFills.forEach(s => {
    s.setAttribute('fill', fitzpatrickColors[skintoneIndex]);
  });
  const skinStrokes = doc.querySelectorAll('#skin [stroke]');
  skinStrokes.forEach(s => {
    s.setAttribute('stroke', fitzpatrickColors[skintoneIndex]);
  });
  const skinShadowFills = doc.querySelectorAll('#skin-shadow [fill]');
  skinShadowFills.forEach(s => {
    s.setAttribute('fill', shadowColors[skintoneIndex]);
  });
  doc.querySelector('#grid').remove();
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

const generateSkintoneMultiple = (srcFilePath, destFilePath, skintones) => {
  const skintoneIndexA = skintones.split(',')[0] - 1;
  const skintoneIndexB = skintones.split(',')[1] - 1;
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;

  // TODO: currently works just for two skintone modifiers
  doc.querySelectorAll('#skin-a [fill]').forEach(s => {
    s.setAttribute('fill', fitzpatrickColors[skintoneIndexA]);
  });
  doc.querySelectorAll('#skin-a [stroke]').forEach(s => {
    s.setAttribute('stroke', fitzpatrickColors[skintoneIndexA]);
  });
  doc.querySelectorAll('#skin-b [fill]').forEach(s => {
    s.setAttribute('fill', fitzpatrickColors[skintoneIndexB]);
  });
  doc.querySelectorAll('#skin-b [stroke]').forEach(s => {
    s.setAttribute('stroke', fitzpatrickColors[skintoneIndexB]);
  });

  doc.querySelector('#grid').remove();
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

// Construct indices for emojis, by path and by hexcode for fast lookup.
import emojis from '../../data/openmoji.json' with { type: 'json' };;
const emojisByTarget = {};
const emojisByHexcode = {};
for (const e of emojis) {
  const target = path.join(folderOut, e.hexcode + '.svg');
  emojisByTarget[target] = e;
  emojisByHexcode[e.hexcode] = e;
}

for (const target of process.argv.slice(2)) {
  const e = emojisByTarget[target];
  const skintoneBaseEmoji = emojisByHexcode[e.skintone_base_hexcode];
  // multiple skintone modifiers
  if (e.skintone_combination === 'multiple') {
    generateSkintoneMultiple(
      path.join(folderSrc, skintoneBaseEmoji.group, skintoneBaseEmoji.subgroups, skintoneBaseEmoji.hexcode + '.svg'),
      target,
      e.skintone
    );
    // single skintone modifier
  } else {
    generateSkintoneSingle(
      path.join(folderSrc, skintoneBaseEmoji.group, skintoneBaseEmoji.subgroups, skintoneBaseEmoji.hexcode + '.svg'),
      target,
      e.skintone - 1 // fitzpatrick starts with 1 and not like an array with 0
    );
  }
}
