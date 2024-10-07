const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');


function mirrorSVGHorizontally(svgContent) {
  const dom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
  const document = dom.window.document;
  const svg = document.querySelector('svg');
  const viewBox = svg.getAttribute('viewBox');

  if (!viewBox) {
    throw new Error("SVG file must have a viewBox attribute.");
  }

  const [minX, minY, viewBoxWidth, viewBoxHeight] = viewBox.split(' ').map(Number);

  if (isNaN(viewBoxWidth) || isNaN(viewBoxHeight)) {
    throw new Error("Invalid viewBox dimensions.");
  }

  const topLevelGroups = svg.querySelectorAll('svg > g');

  topLevelGroups.forEach((g) => {
    if (g.getAttribute('id') !== 'grid') {
      const currentTransform = g.getAttribute('transform') || '';
      const newTransform = `${currentTransform} scale(-1, 1) translate(-${viewBoxWidth + minX}, 0)`;
      g.setAttribute('transform', newTransform);
    }
  });

  return dom.serialize();
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.info('Usage: node mirror-svg.js path/to/source.svg path/to/result.svg');
    process.exit(1);
  }

  const sourcePath = args[0];
  const resultPath = args[1];

  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      process.exit(1);
    }

    try {
      const mirroredSVG = mirrorSVGHorizontally(data);

      fs.writeFile(resultPath, mirroredSVG, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file: ${err.message}`);
          process.exit(1);
        }
        console.log(`Horizontally mirrored SVG saved to ${resultPath}`);
      });
    } catch (error) {
      console.error(`Error processing SVG: ${error.message}`);
      process.exit(1);
    }
  });
}

main();
