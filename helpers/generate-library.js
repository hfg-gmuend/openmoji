#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const emojisList = require('../data/openmoji.json');

let html = `
<!DOCTYPE html>
<html>
<head>
<title>OpenMoji Catalog</title>
<meta charset="UTF-8">
<script src="https://code.jquery.com/jquery-3.3.1.min.js" charset="utf-8"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.min.js"></script>
<style>
[color-scheme='dark'] {
    --background-color-body: #17181c;
    --background-color-toggle: white;
}

[color-scheme='light'] {
    --background-color-toggle: #17181c;
    --background-color-body: white;
}
body {
    max-width: 925px;
    margin: 0 auto;
    background-color: var(--background-color-body)
}
</style>
</head>
<body>
`;

html += `<div id='color'>`
html += _.map(emojisList, (e, i) => {
    if (e.skintone === '') {
        return `<a title="${e.hexcode}">
        <img class="lazy" data-src="${'color/72x72/' + e.hexcode +'.png'}" height="72" width="72"></a>
    `;
    }
}).join('\n');

html += `</div><div id='black' style='display:none;'>`

html += _.map(emojisList, (e, i) => {
    if (e.skintone === '') {
        return `<a title="${e.hexcode}">
        <img class="lazy" data-src="${'black/72x72/' + e.hexcode +'.png'}" height="72" width="72"></a>
    `;
    }
}).join('\n');

html += `</div>

<div style='position: fixed; bottom: 10px; left: 10px; background-color: var(--background-color-toggle); color:var(--background-color-body); padding: 5px; border-radius: 5px;'>
<input type="checkbox" id="colorblackCheckbox"/>
<label for="colorblackCheckbox" id="colorblackToggle"> Toggle Black/Color Emojis</label>
</div>

<div style='position: fixed; bottom: 10px; right: 10px; background-color: var(--background-color-toggle); color:var(--background-color-body); padding: 5px; border-radius: 5px;'>
<input type="checkbox" id="modeCheckbox"/>
<label for="modeCheckbox" id="modeToggle"> Toggle Background Color</label>
</div>

<script type="text/javascript">
$(document).ready(function() {
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

const Toggle = document.getElementById('modeCheckbox');

    Toggle.addEventListener('change', () => {
        if (Toggle.checked) {
            document.documentElement.setAttribute('color-scheme', 'dark');
        } else {
            document.documentElement.setAttribute('color-scheme', 'light');
        }
    });
</script>
</body>
</html>
`;

// write HTML
fs.writeFileSync('library.html', html);