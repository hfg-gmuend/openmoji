#target Illustrator

var CONFIG = {
  artboardIndex: 1,
  stepWidth: 80
};

function main() {
  var originalInteractionLevel = userInteractionLevel;
  userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var dirIn = Folder.selectDialog("Select folder with ai.files");
  // var dirIn = Folder('~/Desktop/tmp/');
  var files = dirIn.getFiles('*.ai');

  processFiles(files);

  userInteractionLevel = originalInteractionLevel;
  return "done";
}

function processFiles(files) {
  var newDoc = app.documents.add(DocumentColorSpace.RGB, files.length * CONFIG.stepWidth, 64);
  for (var i = 0; i < files.length; i++) {
    var srcDoc = app.open(files[i]);
    var targetPos = [i*CONFIG.stepWidth, 64]; // coordinate system starts at bottom and goes up
    println("Processing -> " + srcDoc.name +" | "+ i +" of "+ files.length);
    mergeDocWith(srcDoc, newDoc, targetPos);
    srcDoc.close(SaveOptions.DONOTSAVECHANGES);
  }
}

function mergeDocWith(srcDoc, newDoc, targetPos) {
  var srcDocName = srcDoc.name.replace(/\.svg|\.ai|\.eps|\.pdf/gi, "");

  unlockAll(srcDoc);
  srcDoc.artboards.setActiveArtboardIndex(CONFIG.artboardIndex);
  srcDoc.selectObjectsOnActiveArtboard();
  app.copy();

  app.activeDocument = newDoc;
  var newLayer = newDoc.layers.add();
  newLayer.name = srcDocName;
  app.paste();

  var grid = newLayer.pageItems[newLayer.pageItems.length-1]; // last item
  var offset = [
    grid.position[0] - targetPos[0],
    grid.position[1] - targetPos[1],
  ];
  // println("position: "+grid.position)
  // println("targetPos: "+targetPos)
  // println("offset: " + offset)
  // println("---")
  for (var i = 0; i < newLayer.pageItems.length; i++) {
    newLayer.pageItems[i].translate(offset[0]*-1,offset[1]*-1);
  }
  grid.locked = true;
}

function unlockAll(doc) {
  for (var i = 0; i < doc.layers.length; i++) {
    doc.layers[i].locked = false;
  }
}

function forEach(collection, fn) {
  var n = collection.length;
  for(var i=0; i<n; ++i) {
    fn(collection[i]);
  }
}

function println(txt) {
  $.writeln(txt)
}

main();
