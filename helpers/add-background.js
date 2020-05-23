#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');

const openmojis = require("../data/openmoji.json");

const {
    createDoc
} = require('../test/utils/utils');

const directory = 'srctemp/';
console.log('doing stuff')
openmojis.forEach(emoji => {
    const svgFile = path.join("src", emoji.group, emoji.subgroups, emoji.hexcode + '.svg')
    const doc = createDoc(emoji);

    const root = doc.querySelector("#emoji")

    const backgroundGroup = doc.createElement('g')
    backgroundGroup.setAttribute('id', "background")
    backgroundGroup.setAttribute('xmlns', "http://www.w3.org/2000/svg")

    const beforeNode = doc.querySelector("#grid").nextSibling
    root.insertBefore(backgroundGroup, beforeNode)

    const lineLayer = doc.querySelector("#line")

    const supplementLayer = doc.querySelector("#line-supplement")

    const lineDup = lineLayer.cloneNode(true)

    while (lineDup.children.length) {
        lineDup.children[0].setAttribute('stroke-width', "6")
        lineDup.children[0].setAttribute('stroke', "#fff")
        backgroundGroup.appendChild(lineDup.firstChild);
    }

    if (supplementLayer) {
        const supplementDup = supplementLayer.cloneNode(true)

        while (supplementDup.children.length) {
            supplementDup.children[0].setAttribute('stroke-width', "6")
            supplementDup.children[0].setAttribute('stroke', "#fff")
            backgroundGroup.appendChild(supplementDup.firstChild);
        }
    }

    fs.writeFile(svgFile, doc.documentElement.querySelector("svg").outerHTML, function (err) {
        if (err) return console.log(err);
        console.log('Successful');
    });
})