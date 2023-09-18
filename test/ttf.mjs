import fs from 'fs';
import { expect } from 'chai';
import { Font } from 'lib-font';

const tables_by_format = {
  'black-glyf': ['glyf'],
  'color-cbdt': ['CBDT', 'CBLC'],
  'color-colr0_svg': ['glyf', 'COLR', 'SVG'],
  'color-colr1_svg': ['glyf', 'COLR', 'SVG'],
  'color-glyf_colr_0': ['glyf', 'COLR'],
  'color-glyf_colr_1': ['glyf', 'COLR'],
  'color-picosvgz': ['SVG'],
  'color-sbix': ['sbix'],
  'color-untouchedsvgz': ['SVG'],
};

describe(`TTF`, () => {
  for (const format in tables_by_format) {
    describe(`of format ${format}`, () => {
      const font = new Font();

      before((done) => {
        font.onload = (event) => {
          done();
        };
        font.fromDataBuffer(
          fs.readFileSync(
            `./font/OpenMoji-${format}/OpenMoji-${format}.ttf`
          ).buffer
        );
      });

      describe('has table', () => {
        for (const table of tables_by_format[format]) {
          it(table, () => {
            expect(font.opentype.tables).property(table)
          });
        }
      })
    });
  }
});
