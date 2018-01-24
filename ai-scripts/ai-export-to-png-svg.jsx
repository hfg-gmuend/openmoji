#target Illustrator

var CONFIG = {
  artboardIndex: 0
};

function main() {
  var originalInteractionLevel = userInteractionLevel;
  userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var dirIn = Folder.selectDialog("Select folder with .ai files");
  // var dirIn = Folder('~/Desktop/tmp/');
  var dirOut = Folder.selectDialog("Select folder for PNG and SVG export");
  // var dirOut = Folder('~/Desktop/tmp/export');

  var files = dirIn.getFiles("*.ai");
  for (var i = 0; i < files.length; i++) {
    try {
      var doc = app.open(files[i]);
      println("Processing -> " + doc.name +" | "+ i +" of "+ files.length);
      exportDoc(doc, dirOut);
    }
    catch(e) {
      alert(doc.name, "This file is buggy :(", true);
    }
  }

  userInteractionLevel = originalInteractionLevel;
  return "done";
}

function exportDoc(doc, dirOut) {
  removeAllArtboardsBut(doc, CONFIG.artboardIndex)

  unlockAll(doc);
  doc.artboards.setActiveArtboardIndex(0);
  doc.selectObjectsOnActiveArtboard();

  // remove all items not on active artboard
  // https://ten5963.wordpress.com/illustrator-ccver-22-menu-commands-list/
  app.executeMenuCommand("Inverse menu item");
  app.executeMenuCommand("clear");

  // find grid and group it
  var gridLayer = doc.layers.getByName("grid");
  selectItems(gridLayer.pageItems);
  app.executeMenuCommand("group");

  // expand styles and resize artboard to grid bounds and remove layer afterwards
  app.executeMenuCommand("expandStyle");
  var grid = gridLayer.groupItems[gridLayer.groupItems.length-1]; // last item
  doc.artboards[0].artboardRect = grid.geometricBounds;
  gridLayer.remove();

  // delete everything else
  doc.selectObjectsOnActiveArtboard();
  app.executeMenuCommand("Inverse menu item");
  app.executeMenuCommand("clear");

  // remove layer "description"
  var descriptionLayer = doc.layers.getByName("description");
  descriptionLayer.remove();

  // export
  var fileName = doc.name.replace(/\.svg|\.ai|\.eps|\.pdf/gi, "");
  exportPng(doc, new File(dirOut.fsName+"/"+fileName+".png"));
  exportSvg(doc, new File(dirOut.fsName+"/"+fileName+".svg"));
  doc.close(SaveOptions.DONOTSAVECHANGES);
}

function selectItems(items) {
  for (var i = 0; i < items.length; i++) {
    items[i].selected = true;
  }
}

function removeAllArtboardsBut(doc, index) {
  for (var i = doc.artboards.length-1; i >= 0; i--) {
    if (i === index) continue;
    doc.artboards[i].remove(i);
  }
}

function exportPng(doc, newFile) {
  var pngOptions = new ExportOptionsPNG24();
  pngOptions.antiAliasing = true;
  pngOptions.transparency = true;
  pngOptions.artBoardClipping = true;
  doc.exportFile(newFile, ExportType.PNG24, pngOptions);
}

function exportSvg(doc, newFile) {
  var svgOptions = new ExportOptionsSVG();
  svgOptions.embedRasterImages = false;
  svgOptions.DTD = SVGDTDVersion.SVG1_1;
  svgOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
  svgOptions.fontSubsetting = SVGFontSubsetting.None;
  svgOptions.documentEncoding = SVGDocumentEncoding.UTF8;
  svgOptions.coordinatePrecision = 1;
  doc.exportFile(newFile, ExportType.SVG, svgOptions);
}

function unlockAll(doc) {
  for (var i = 0; i < doc.layers.length; i++) {
    doc.layers[i].locked = false;
  }
}

function println(txt) {
  $.writeln(txt)
}

main();
