#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const emojisList = require('../data/openmoji.json');

let html = `
<!DOCTYPE html>
<html lang='en'>
<head>
<title>OpenMoji Catalog</title>
<meta charset="UTF-8">
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.min.js"></script>
<style>
[color-scheme='dark'] {
    --background-color-body: #17181c;
    --background-hover: #333;
}

[color-scheme='light'] {
    --background-color-body: white;
    --background-hover: url("guidelines/openmoji-template.svg") #fff;
}
body {
    max-width: 910px;
    margin: 0 auto;
    background-color: var(--background-color-body);
    transition: background-color 0.5s ease;
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
    transform: scale(1.5);
}

button:focus {
    outline: 1px solid var(--background-color-toggle);
    outline-offset: -4px;
}

button:active {
    transform: scale(1.4);
}

button p {
	line-height: 72px;
	font-size: 44px;
	margin: 0;
}

.toggle {
    position: fixed;
    background-color: #aaa;
    color: var(--background-color-body);
    padding: 5px;
    border-radius: 5px;
    height: 25px
}
</style>
</head>
<body color-scheme='light'>
<p style='text-align: center; padding: 15px; font-style: italic; color: #999;'> click to copy codepoint </p>
`;

html += `<div id='color'>`
html += _.map(emojisList, (e, i) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <img class="lazy"  alt="${e.annotation}" title="${e.annotation} - ${e.hexcode}" 
        src="${'color/72x72/' + e.hexcode +'.png'}" height="72" width="72">
        </button>
    `;
    }
}).join('\n');

html += `</div><div id='black' style='display:none;'>`

html += _.map(emojisList, (e, i) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <img class="lazy"  alt="${e.annotation}" title="${e.annotation} - ${e.hexcode}" 
        src="${'black/72x72/' + e.hexcode +'.png'}" height="72" width="72">
        </button>
    `;
    }
}).join('\n');

html += `</div><div id='system' style='display:none;'>`

html += _.map(emojisList, (e, i) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <p title="${e.annotation} - ${e.hexcode}">${e.emoji}</p>
        </button>
    `;
    }
}).join('\n');

html += `</div>

<div class='toggle' style='bottom: 55px; left: 10px;'>
<input type="checkbox" id="openmojisystemCheckbox"/>
<label for="openmojisystemCheckbox" id="openmojisystemToggle"> Toggle System Emojis</label>
</div>

<div class='toggle' style='bottom: 10px; left: 10px;'>
<input type="checkbox" id="colorblackCheckbox"/>
<label for="colorblackCheckbox" id="colorblackToggle"> Toggle Black/Color Emojis</label>
</div>

<div class='toggle' style='bottom: 10px; right: 10px;'>
<input type="checkbox" id="modeCheckbox"/>
<label for="modeCheckbox" id="modeToggle"> Toggle Background Color</label>
</div>

<script>
$(document).ready(function () {
    // lazy loading images
    $('.lazy').Lazy();
});

const colorblackToggle = document.getElementById('colorblackCheckbox');

colorblackToggle.addEventListener('change', () => {
    if (colorblackToggle.checked) {
        document.getElementById('black').style = "";
        document.getElementById('color').style = "display:none";
        document.getElementById('system').style = "display:none";
    } else {
        document.getElementById('system').style = "display:none";
        document.getElementById('black').style = "display:none";
        document.getElementById('color').style = "";
    }
});

const openmojisystemToggle = document.getElementById('openmojisystemCheckbox');

openmojisystemToggle.addEventListener('change', () => {
    if (openmojisystemToggle.checked) {
        document.getElementById('system').style = "";
        document.getElementById('color').style = "display:none";
        document.getElementById('black').style = "display:none";
    } else {
        document.getElementById('system').style = "display:none";
        if (colorblackToggle.checked) {
            document.getElementById('black').style = "";
        } else {
            document.getElementById('color').style = "";
        }
    }
});

const modeToggle = document.getElementById('modeCheckbox');

modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
        document.body.setAttribute('color-scheme', 'dark');
    } else {
        document.body.setAttribute('color-scheme', 'light');
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
