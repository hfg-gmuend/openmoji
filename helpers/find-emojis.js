#!/usr/bin/env node

// This utility prints all the hexcodes of emojis with matching hexcodes or
// annotations.
// With no arguments, lists all hexcodes.

import data from '../data/openmoji.json' assert {type: 'json'};

const makeMatcher = (value) => (entry) =>
  value == entry.hexcode ||
  value == entry.annotation;

const makeTagMatcher = (value) => (entry) => [
    ...entry.tags.split(', '),
    ...entry.openmoji_tags.split(', '),
  ].some((tag) => tag === value);

const matchHasSkintones = (entry) => entry.skintone;

const matchInverse = (f) => (entry) => !f(entry);

const hexColumn = (entry) => entry.hexcode;
const pathColumn = (entry) => `${entry.group}/${entry.subgroups}`;
const baseColumn = (entry) => entry.skintone_base_hexcode;

// Parse arguments
const matchers = [];
const columns = [hexColumn];
const args = process.argv[Symbol.iterator]();
args.next(); // node
args.next(); // find-emojis.js
let arg, done;
while ({value: arg, done} = args.next(), !done) {
  if (arg.startsWith('-')) {
    if (arg === '--') {
      break;
    } else if (arg === '--has-tag') {
        ({value: arg} = args.next());
        matchers.push(makeTagMatcher(arg));
    } else if (arg === '--has-skintones') {
        matchers.push(matchHasSkintones);
    } else if (arg === '--has-no-skintones') {
        matchers.push(matchInverse(matchHasSkintones));
    } else if (arg === '--show-path') {
      columns.push(pathColumn);
    } else if (arg === '--show-skintone-base') {
      columns.push(baseColumn);
    } else {
      console.error('Invalid argument: ', arg);
      process.exit(-1);
    }
  } else {
      matchers.push(makeMatcher(arg));
  }
}
while ({value: arg, done} = args.next(), !done) {
    matchers.push(makeMatcher(arg));
}

const writeRow = (entry) => {
  console.log(columns.map((col) => col(entry)).join('\t'));
}

// Filter for specified hexcodes or annotation names.
if (matchers.length > 0) {
  for (const entry of data) {
    if (matchers.some((match) => match(entry))) {
      writeRow(entry);
    }
  }

// List all hexcodes
} else {
  for (const entry of data) {
    writeRow(entry);
  }
}
