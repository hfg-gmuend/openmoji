#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const emojisList = require('../data/openmoji.json');

let html = `
<!DOCTYPE html>
<html color-scheme='light'>
<head>
<title>OpenMoji Catalog</title>
<meta charset="UTF-8">
<script src="https://code.jquery.com/jquery-3.3.1.min.js" charset="utf-8"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.min.js"></script>
<style>
[color-scheme='dark'] {
    --background-color-body: #17181c;
    --background-hover: #333;
}

[color-scheme='light'] {
    --background-color-body: white;
    --background-hover: #ddd;
}
body {
    max-width: 925px;
    margin: 0 auto;
    background-color: var(--background-color-body)
}
button {
    display: inline-block;
    border: none;
    padding: 0;
    margin: 0;
    text-decoration: none;
    background: transparent;
    border-radius: 5px;
    font-family: sans-serif;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out, 
                transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 72px;
    height: 72px;
}

button:hover,
button:focus {
    background: var(--background-hover);
}

button:focus {
    outline: 1px solid var(--background-color-toggle);
    outline-offset: -4px;
}

button:active {
    transform: scale(0.95);
}
</style>
</head>
<body>
<p style='text-align: center; padding: 15px; font-style: italic; color: #888;'> click to copy codepoint </p>
`;

html += `<div id='color'>`
html += _.map(emojisList, (e, i) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <img class="lazy"  alt="${e.annotation}" title="${e.annotation} - ${e.hexcode}" 
        data-src="${'color/72x72/' + e.hexcode +'.png'}" height="72" width="72">
        </button>
    `;
    }
}).join('\n');

html += `</div><div id='black' style='display:none;'>`

html += _.map(emojisList, (e, i) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <img class="lazy"  alt="${e.annotation}" title="${e.annotation} - ${e.hexcode}" 
        data-src="${'black/72x72/' + e.hexcode +'.png'}" height="72" width="72">
        </button>
    `;
    }
}).join('\n');

html += `</div>

<div style='position: fixed; bottom: 10px; left: 10px; background-color: #aaa; color:var(--background-color-body); padding: 5px; border-radius: 5px;'>
<input type="checkbox" id="colorblackCheckbox"/>
<label for="colorblackCheckbox" id="colorblackToggle"> Toggle Black/Color Emojis</label>
</div>

<div style='position: fixed; bottom: 10px; right: 10px; background-color: #aaa; color:var(--background-color-body); padding: 5px; border-radius: 5px;'>
<input type="checkbox" id="modeCheckbox"/>
<label for="modeCheckbox" id="modeToggle"> Toggle Background Color</label>
</div>

<script type="text/javascript">
$(document).ready(function () {
    // lazy loading images
    $('.lazy').Lazy();
});

const colorblackToggle = document.getElementById('colorblackCheckbox');

colorblackToggle.addEventListener('change', () => {
    if (colorblackToggle.checked) {
        document.getElementById('black').style = "";
        document.getElementById('color').style = "display:none";
    } else {
        document.getElementById('black').style = "display:none";
        document.getElementById('color').style = "";
    }
});

const modeToggle = document.getElementById('modeCheckbox');

modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
        document.documentElement.setAttribute('color-scheme', 'dark');
    } else {
        document.documentElement.setAttribute('color-scheme', 'light');
    }
});

function copyToClipboard(value) {
    var temp = document.createElement('input')
    document.body.append(temp);
    temp.value = value
    temp.select();
    document.execCommand("copy");
    temp.parentNode.removeChild(temp);
}
</script>
</body>
</html>
`;

// write HTML
fs.writeFileSync('index.html', html);