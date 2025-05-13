import _glob from 'glob';
import lodash from 'lodash';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const { minBy, maxBy, first, range } = lodash;
const { sync: glob } = _glob;

const __dirname = dirname(fileURLToPath(import.meta.url));

const srcFiles = glob(path.join(__dirname, '../src/extras-openmoji/**/*.svg'));
console.log('Found', srcFiles.length, 'extras-openmoji');

let extras = {};

srcFiles.forEach(f => {
  const [filename, subgroups, group] = f.split(path.sep).reverse();
  const hexcode = path.basename(filename, '.svg');
  let key = `${group}/${subgroups}`;
  if (!extras[key]) extras[key] = [];
  extras[key].push({ hexcode, index: parseInt(hexcode, 16) });
});

for (const [srcPath, hexcodes] of Object.entries(extras)) {
  console.log(`\n${srcPath} (${hexcodes.length})`);

  let madeUpCombinations = hexcodes.filter(h => h.hexcode.includes('-'));
  if (madeUpCombinations.length > 0) {
    console.log('  Made up combinations hexcodes:', madeUpCombinations.length);
  }

  let privateUseHexcodes = hexcodes.filter(h => h.hexcode.startsWith('E') && !h.hexcode.includes('-'));
  if (privateUseHexcodes.length > 0) {
    console.log('  Private area hexcodes:', privateUseHexcodes.length);
    let firstHexcode = minBy(privateUseHexcodes, 'index');
    let lastHexcode = maxBy(privateUseHexcodes, 'index');
    console.log(`  First: ${firstHexcode.hexcode}`);
    console.log(`  Last: ${lastHexcode.hexcode}`);
    let rangeHexcode = lastHexcode.index - firstHexcode.index + 1;
    // no gaps
    if (rangeHexcode === privateUseHexcodes.length) {
      let nextAvailableHexcode = (lastHexcode.index + 1).toString(16).toUpperCase();
      console.log(`  Next available:`, logColor(nextAvailableHexcode, 'bgGreen'));
    }
    else {
      let missingHexcodes = [];
      for (let i = firstHexcode.index; i <= lastHexcode.index; i++) {
        const hexcode = i.toString(16).toUpperCase();
        if (!hexcodes.find(h => h.hexcode === hexcode)) missingHexcodes.push(hexcode);
      }
      console.log(`  Gaps:`, missingHexcodes.map(h => logColor(h, 'bgMagenta')).join(', '));
    }
  }
}

function logColor(message, color) {
  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
  };
  return `${colors[color]}${message}${colors.reset}`;
}

