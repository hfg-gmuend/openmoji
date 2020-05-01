const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chroma = require('chroma-js');
const KDTree = require('kd-tree-javascript').kdTree;
const JSDOM = require('jsdom').JSDOM;


const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const prettyfyFigmaSVG = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;
  let modified = false;

  // Problem: figma will add a `fill="none"` attribute to the svg element. all child elements will implicitly be set to `fill="none"`. we instead want svg's default behaivior

  const svgWithFillNone = doc.querySelector('svg[fill="none"]');
  if (svgWithFillNone) {
    svgWithFillNone.removeAttribute('fill');
    const elementsWithoutFill = svgWithFillNone.querySelectorAll('circle:not([fill]), ellipse:not([fill]), path:not([fill]), polygon:not([fill]), polyline:not([fill]), rect:not([fill])')
    elementsWithoutFill.forEach(el => {
      el.setAttribute('fill', 'none');
    });

    modified = true;
  }

  // Problem: figma will automatically add ids based on the type of element. 

  const figmaDefaultIds = ['Rectangle', 'Vector', 'Line', 'Arrow', 'Ellipse', 'Star', 'Polygon', 'Union', 'Subtract', 'Intersect', 'Exclude', 'Group'];
  const elementsWithId = doc.querySelectorAll('[id^="' + figmaDefaultIds.join('"], [id^="') + '"]');
  elementsWithId.forEach(el => {
    el.removeAttribute('id');
    modified = true;
  });

  // Problem: figma will create a root element `g` with an id that is equal to the artboard name

  const rootGroup = doc.querySelector('svg > g[id]:only-child');
  if (rootGroup) {
    let parent = rootGroup.parentNode;
    while (rootGroup.firstChild) parent.insertBefore(rootGroup.firstChild, rootGroup);
    parent.removeChild(rootGroup);
    modified = true;
  }

  if (modified) {
    console.log('cleaning up -> ', srcFilePath);
  }
  fs.unlinkSync(srcFilePath);
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
}

function searchDirectoryForFigma(startPath) {
  let files = fs.readdirSync(startPath);
  for(let i = 0; i < files.length; i++){
    let filename = path.join(startPath,files[i]);
    let stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
       searchDirectoryForFigma(filename);
    }
    else if (filename.indexOf('.figma.svg') >= 0) {
      prettyfyFigmaSVG(filename, filename.replace('.figma.svg', '.svg'));
    };
  };
};

searchDirectoryForFigma('./src');
