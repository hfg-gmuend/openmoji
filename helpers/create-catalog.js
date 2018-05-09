const path = require('path');
const fsSync = require('fs-sync');
const _ = require('lodash');

const emojisList = require('../data/openmoji.json');

let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td, th {
    border: 1px solid #ddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #eee;
}
</style>
</head>
<body>
<table>
    <tr>
        <td>#</td>
        <td>PNG</td>
        <td>SVG</td>
        <td>PNG</td>
        <td>SVG</td>
        <td>emoji</td>
        <td>hexcode</td>
        <td>group</td>
        <td>subgroups</td>
        <td>annotation</td>
        <td>tags</td>
        <td>hfg_tags</td>
        <td>hfg_author</td>
        <td>AI>⬇</a></td>
    </tr>
`;

html += _.map(emojisList, (e, i) => {
  return `
    <tr>
        <td>${i}</td>
        <td><img src="${'black/72x72/' + e.hexcode +'.png'}" height="72" width="72"></td>
        <td><img src="${'black/svg/' + e.hexcode +'.svg'}" height="72" width="72"></td>
        <td><img src="${'color/72x72/' + e.hexcode +'.png'}" height="72" width="72"></td>
        <td><img src="${'color/svg/' + e.hexcode +'.svg'}" height="72" width="72"></td>
        <td>${e.emoji}</td>
        <td>${e.hexcode}</td>
        <td>${e.group}</td>
        <td>${e.subgroups}</td>
        <td>${e.annotation}</td>
        <td>${e.tags.replace(/,/g, ', ')}</td>
        <td>${e.hfg_tags.replace(/,/g, ', ')}</td>
        <td>${e.hfg_author}</td>
        <td><a href="src/${e.group +'/'+ e.subgroups +'/'+ e.hexcode +'.ai'}">⬇</a></td>
    </tr>
    `;
}).join('\n');

html += `
</table>
</body>
</html>
`;

// write HTML
fsSync.write('index.html', html);
