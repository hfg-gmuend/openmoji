const path = require('path');
const fs = require('fs');
const _ = require('lodash');

let emojis = require('../data/openmoji.json');
emojis = _.filter(emojis, (e) => { return e.skintone == ''});

let html = `
<!DOCTYPE html>
<html>
<head>
<title>OpenMoji Debug</title>
<meta charset="UTF-8">
<script src="https://code.jquery.com/jquery-3.3.1.min.js" charset="utf-8"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.min.js"></script>
<style>
table {
  font-family: arial, sans-serif;
  font-size: 15px;
  border-collapse: collapse;
  width: 100%;
}

.emoji-os {
  font-size: 35px;
}

.svg-src {
  width: 144px;
  height: 144px;
}

.svg-src #grid {
  display: none;
}

.svg-src.line #color,
.svg-src.line #color-foreground,
.svg-src.line #hair,
.svg-src.line #skin,
.svg-src.line #skin-shadow {
  display: none;
}

.svg-src.color #line,
.svg-src.color #line-supplement,
.svg-src.color #hair,
.svg-src.color #skin,
.svg-src.color #skin-shadow {
  display: none;
}

.svg-src.hair g:not(#hair) {
  display: none;
}

.svg-src.skin g:not(#skin) {
  display: none;
}

.svg-src.skin-shadow g:not(#skin-shadow) {
  display: none;
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
  <thead>
    <tr>
      <td>#</td>
      <td>emoji</td>
      <td>old color 1.0</td>
      <td>old black 1.0</td>
      <td>new color</td>
      <td>line layers</td>
      <td>color layers</td>
      <td>hair layer</td>
      <td>skin layer</td>
      <td>skin-shadow layer</td>
      <td>hexcode</td>
      <td>group</td>
      <td>subgroups</td>
      <td>tags</td>
      <td>author</td>
    </tr>
  </thead>
  <tbody>
`;

html += _.map(emojis, (e, i) => {
  // if (Math.floor(i/250) !== 0) return;
  // if (e.hexcode !== '1F6B2') return;
  return `
    <tr>
        <td>${i}</td>
        <td><span class="emoji-os">${e.emoji}</span></td>
        <td><img class="lazy" data-src="${'http://openmoji.org/data/color/svg/' + e.hexcode +'.svg'}" height="144" width="144"></td>
        <td><img class="lazy" data-src="${'http://openmoji.org/data/black/svg/' + e.hexcode +'.svg'}" height="144" width="144"></td>
        <td><img class="svg-src" src="${'src/' + e.group +'/'+ e.subgroups +'/'+ e.hexcode + '.svg'}" height="144" width="144"></td>
        <td><img class="svg-src line" src="${'src/' + e.group +'/'+ e.subgroups +'/'+ e.hexcode + '.svg'}" height="144" width="144"></td>
        <td><img class="svg-src color" src="${'src/' + e.group +'/'+ e.subgroups +'/'+ e.hexcode + '.svg'}" height="144" width="144"></td>
        <td><img class="svg-src hair" src="${'src/' + e.group +'/'+ e.subgroups +'/'+ e.hexcode + '.svg'}" height="144" width="144"></td>
        <td><img class="svg-src skin" src="${'src/' + e.group +'/'+ e.subgroups +'/'+ e.hexcode + '.svg'}" height="144" width="144"></td>
        <td><img class="svg-src skin-shadow" src="${'src/' + e.group +'/'+ e.subgroups +'/'+ e.hexcode + '.svg'}" height="144" width="144"></td>
        <td>${e.hexcode}</td>
        <td>${e.group}</td>
        <td>${e.subgroups}</td>
        <td>${e.tags}</td>
        <td>${e.openmoji_author}</td>
    </tr>
    `;
}).join('\n');

html += `
  <tbody>
</table>
<script type="text/javascript">
$(document).ready(function() {
  // lazy loading images
  $('.lazy').Lazy();
  // replace img tags with inline svgs
  $('.svg-src').each(function(){
    var $img = $(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    $.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = $(data).find('svg');
      // Add replaced image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass+' replaced-svg');
      }
      // Replace image with new SVG
      $img.replaceWith($svg);
    }, 'xml');
  });
});
</script>
</body>
</html>
`;

// write HTML
fs.writeFileSync('index-debug.html', html);
