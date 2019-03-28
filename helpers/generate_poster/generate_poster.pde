import processing.pdf.*;

int top = 10;
int right = 10;
int bottom = 10;
int left = 10;
int lineLeading = 3;

JSONArray openmojis;
int lineCount = 100;
boolean done = false;
String openmojiPath;

void settings() {
  // 2383,937 pt x 3370,394 pt
  // DIN-Format A0: 84,1 x 118,9 cm
  // size(int(2384/4), int(3370/4));
  size(int(2384), int(3370));
}

void setup() {
  File sketch = new File(sketchPath());
  File openmojiFolder = sketch.getParentFile().getParentFile();
  openmojiPath = openmojiFolder.getAbsolutePath();
  println(openmojiPath);

  openmojis = loadJSONArray(openmojiPath + "/data/openmoji.json");
}

void draw() {
  background(255);

  // calculate grid
  int emojisCount = openmojis.size();
  float rectSize = (width - right - left) / (float)lineCount;
  float posY = top;

  for (int i = 0; i < emojisCount; i++) {
    int lineIndex = i / lineCount;
    int columnIndex = i % lineCount;
    float posX = left + rectSize * columnIndex;
    posY = top + (rectSize + lineLeading) * lineIndex;
    // rect(posX, posY, rectSize, rectSize);
  }

  if ((posY + rectSize * 3) < (height - bottom - rectSize)) {
    lineCount = lineCount - 1;
  } else {
    done = true;
  }
  

  // load svg and create pdf
  if (done) {
    beginRecord(PDF, "OpenMoji-Poster.pdf");
    for (int i = 0; i < emojisCount; i++) {
      JSONObject emoji = openmojis.getJSONObject(i);
      String hexcode = emoji.getString("hexcode");
      
      int lineIndex = i / lineCount;
      int columnIndex = i % lineCount;
      float posX = left + rectSize * columnIndex;
      posY = top + (rectSize + lineLeading) * lineIndex;
      noStroke();
      noFill();
      String imgPath = openmojiPath + "/color/618x618/" + hexcode + ".png";
      println(i, imgPath);
      PImage img = loadImage(imgPath);
      image(img, posX, posY, rectSize, rectSize);
    }
    endRecord();
    println("done");
    noLoop();
  }
}
