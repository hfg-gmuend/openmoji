const svg2png = require('svg2png-many');
var srcDir = 'svg';
var dstDir500 = 'png500';
var dstDir250 = 'png250';
var dstDir1000 = 'png1000';

parallelRenders = 1;

var sizes = [
  {height: 250,width: 250},
  {height: 500,width: 500},
  {height: 1000,width: 1000}
]


svg2png.svg2PngDir(srcDir, dstDir250, sizes[0], parallelRenders).then(
  () => console.log('Done'),
  // rejected with the list of all happened errors
  // even if error happens while processing one file it will not stop conversion other files
  // first all files are processed, only then the result promise is rejected or resolved
  errors => errors.forEach(error => {
    arrors = Array.isArray(errors) ? errors : [errors];
    console.error(error.stack || error);
  })
);

svg2png.svg2PngDir(srcDir, dstDir500, sizes[1], parallelRenders).then(
  () => console.log('Done'),
  // rejected with the list of all happened errors
  // even if error happens while processing one file it will not stop conversion other files
  // first all files are processed, only then the result promise is rejected or resolved
  errors => errors.forEach(error => {
    arrors = Array.isArray(errors) ? errors : [errors];
    console.error(error.stack || error);
  })
);

svg2png.svg2PngDir(srcDir, dstDir1000, sizes[2], parallelRenders).then(
  () => console.log('Done'),
  // rejected with the list of all happened errors
  // even if error happens while processing one file it will not stop conversion other files
  // first all files are processed, only then the result promise is rejected or resolved
  errors => errors.forEach(error => {
    arrors = Array.isArray(errors) ? errors : [errors];
    console.error(error.stack || error);
  })
);
