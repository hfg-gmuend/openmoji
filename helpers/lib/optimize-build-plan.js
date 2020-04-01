#!/usr/bin/env node
'use strict';

// This script assists optimize-build.sh by reading all of the file names in
// the build plan conversions and filtering out the ones that have already been
// done by comparing their hashes.
//
// $2 is the plan consisting of colon delimited file names.
// $3 is the current output from git ls-files for relevant files.
// $4 is the output from ls-files generated previously.

let FS = require("fs");

function *lines(text) {
  let i = 0;
  while (i < text.length) {
    const j = text.indexOf("\n", i);
    if (j < 0) {
      yield text.slice(i, text.length);
      i = text.length;
    } else {
      yield text.slice(i, j);
      i = j + 1;
    }
  }
}

function readGitList(text) {
  const map = new Map();
  for (const line of lines(text)) {
    const [meta, file] = line.split("\t");
    const [_, hash] = meta.split(" ");
    map.set(file, hash);
  }
  return map;
}

const plan = FS.readFileSync(process.argv[2], 'utf-8');
const hashes = readGitList(FS.readFileSync(process.argv[3], 'utf-8'));
const memo = readGitList(FS.readFileSync(process.argv[4], 'utf-8'));

for (const line of lines(plan)) {
  if (!line.split("\t").every((file) => memo.get(file) == hashes.get(file))) {
    console.log(line);
  }
}
