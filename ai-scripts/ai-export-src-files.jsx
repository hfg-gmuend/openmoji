#target Illustrator

function main() {
  var originalInteractionLevel = userInteractionLevel;
  userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var dirSrc = Folder.selectDialog("Select 'src' folder with .ai files");
  // var dirSrc = Folder('~/Desktop/tmp/');
  var dirBlack = Folder.selectDialog("Select 'black' folder for PNG and SVG export");
  // var dirBlack = Folder('~/Desktop/black/');
  var dirColor = Folder.selectDialog("Select 'color' folder for PNG and SVG export");
  // var dirColor = Folder('~/Desktop/color/');

  var files = getFilesRecursive( dirSrc, ".ai");
  println(files.length);

  for (var i = 0; i < files.length; i++) {
    try {
      var doc = app.open(files[i]);
      println("Processing Black -> " + doc.fullName +" | "+ i +" of "+ files.length);
      exportDoc(doc, 0, dirBlack);
      doc.close(SaveOptions.DONOTSAVECHANGES);

      var doc = app.open(files[i]);
      println("Processing Color -> " + doc.fullName +" | "+ i +" of "+ files.length);
      exportDoc(doc, 1, dirColor);
      doc.close(SaveOptions.DONOTSAVECHANGES);
    }
    catch(e) {
      alert(doc.fullName, "This file is buggy :(", true);
    }
  }

  userInteractionLevel = originalInteractionLevel;
  return 'done';
}

function exportDoc(doc, artboardIndex, dirOut) {
  removeAllArtboardsBut(doc, artboardIndex)

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
  exportPng(doc, new File(dirOut.fsName+"/72x72/"+fileName+".png"));
  exportPng(doc, new File(dirOut.fsName+"/618x618/"+fileName+".png"), 858.3);
  exportSvg(doc, new File(dirOut.fsName+"/svg/"+fileName+".svg"));
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

function exportPng(doc, newFile, scale) {
  var pngOptions = new ExportOptionsPNG24();
  if (scale) {
    pngOptions.horizontalScale = scale;
    pngOptions.verticalScale = scale;
  }
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

function getFilesRecursive(folder, fileType) {
  function _traverseFolder(folder, fileType) {
    var files = folder.getFiles();
    for (var i = 0; i < files.length; i++) {
      if (files[i] instanceof File) {
        if (files[i].name.indexOf(fileType) > 0) {
          // println(files[i]);
          results.push(files[i]);
        }
      } else {
        _traverseFolder(files[i], fileType);
      }
    }
  }
  var results = [];
  _traverseFolder(folder, fileType);
  return results;
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
