#target Illustrator
#include "./lib.jsx"

function main() {
  var originalInteractionLevel = userInteractionLevel;
  userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var dirSrc = Folder.selectDialog("Select 'src' folder with .ai files");
  var dirBlack = Folder.selectDialog("Select 'black' folder for SVG export");
  var dirColor = Folder.selectDialog("Select 'color' folder for SVG export");

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

main();
