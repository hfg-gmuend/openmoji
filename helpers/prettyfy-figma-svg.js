const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chroma = require('chroma-js');
const KDTree = require('kd-tree-javascript').kdTree;
const JSDOM = require('jsdom').JSDOM;
const { exec } = require("child_process");


const writeSvg = (filePath, data) => {
  fs.writeFileSync(filePath, data);
}

const prettyfyFigmaSVG = (srcFilePath, destFilePath) => {
  const dom = new JSDOM(fs.readFileSync(srcFilePath, 'utf8'));
  const doc = dom.window.document;

  // Problem: figma will add a `fill="none"` attribute to the svg element. all child elements will implicitly be set to `fill="none"`. we instead want svg's default behaivior
  const svgWithFillNone = doc.querySelector('svg[fill="none"]');
  if (svgWithFillNone) {
    svgWithFillNone.removeAttribute('fill');
    const elementsWithoutFill = svgWithFillNone.querySelectorAll('circle:not([fill]), ellipse:not([fill]), path:not([fill]), polygon:not([fill]), polyline:not([fill]), rect:not([fill])')
    elementsWithoutFill.forEach(el => {
      el.setAttribute('fill', 'none');
    });
  }

  // Problem: figma will automatically add ids based on the type of element. 

  const figmaDefaultIds = ['Rectangle', 'Vector', 'Line', 'Arrow', 'Ellipse', 'Star', 'Polygon', 'Union', 'Subtract', 'Intersect', 'Exclude', 'Group'];
  const elementsWithId = doc.querySelectorAll('[id^="' + figmaDefaultIds.join('"], [id^="') + '"]');
  elementsWithId.forEach(el => {
    el.removeAttribute('id');
  });

  // Problem: figma will create a root element `g` with an id that is equal to the artboard name

  const rootGroup = doc.querySelector('svg > g[id]:only-child');
  if (rootGroup) {
    let parent = rootGroup.parentNode;
    while (rootGroup.firstChild) parent.insertBefore(rootGroup.firstChild, rootGroup);
    parent.removeChild(rootGroup);
  }

  doc.querySelector('svg').setAttribute('id','emoji');

  console.log('cleaning up -> ', srcFilePath);
  fs.unlinkSync(srcFilePath);
  writeSvg(destFilePath, doc.querySelector('svg').outerHTML);
  
  exec(`./node_modules/.bin/svgo ${destFilePath} --config helpers/beautify-svg.yml`, (error, stdout, stderr) => {
    if (error) {
        console.log(`SVGO failed: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`SVGO failed: ${stderr}`);
        return;
    }
    console.log(`File beautified with SVGO: ${stdout}`);
  });
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
