#target Illustrator
#include "./lib.jsx"

function main() {
  var originalInteractionLevel = userInteractionLevel;
  userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

  var files = File.openDialog("Select 'src' .ai files", "*.ai", true);
  if (!files) return; // nothing selected
  if (!files.length) files = [files]; // just a single file selected, make sure it becomes an array
  var srcFolder = files[0].path;

  // create folders for epxorted files
  var dirBlack = createFolder(srcFolder + "/black/");
  createFolder(srcFolder + "/black/72x72");
  createFolder(srcFolder + "/black/618x618");
  createFolder(srcFolder + "/black/svg");
  var dirColor = createFolder(srcFolder + "/color/");
  createFolder(srcFolder + "/color/72x72");
  createFolder(srcFolder + "/color/618x618");
  createFolder(srcFolder + "/color/svg");

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
