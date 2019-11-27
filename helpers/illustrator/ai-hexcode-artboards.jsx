#target Illustrator
#include "./utils/underscore.js"

function main() {
  var hexcodeStartString = prompt("Rename Artboards with Hexcode sequence. Enter start HexCode:", "------");
  if (hexcodeStartString === null) return "ERROR";

  var doc = activeDocument;
  var artboards = doc.artboards;

  var artboardsSorted = _.sortBy(artboards, function(artboard){
    var x = artboard.artboardRect[0];
    var y = artboard.artboardRect[1] * -1;
    x = pad(x, 5);
    y = pad(y, 5);
    var idPosition = [y, x].join('_')
    println(idPosition);
    return idPosition;
  });

  var hexcodeStart = parseInt(hexcodeStartString, 16)
  println(["hexcodeStart:", hexcodeStart].join(" "));
  for (var i = 0; i < artboardsSorted.length; i++) {
    var hexcode = Number(hexcodeStart + i).toString(16)
    println(["index:", i, "hexcode:", hexcode].join(" "));
  	artboardsSorted[i].name = hexcode.toUpperCase();
  }

  return "DONE";
}

function pad(n, width, z) {
  var z = z || '0';
  var n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function println(txt) {
  $.writeln(txt)
}

main();
