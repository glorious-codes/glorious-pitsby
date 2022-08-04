const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const webappHtmlIndexGenerator = require('./src/cli/services/webapp-html-index-generator');
const webappIndexGenerator = require('./src/cli/services/webapp-index-generator');

function init(){
  const basepath = './src/webapp';
  const files = ['index.html', 'scripts/index.js'];
  removeAssets(basepath, directories.concat(files));
  initFileGenerators();
}

function removeAssets(basepath, assetPaths){
  assetPaths.forEach(path => rimraf.sync(`${basepath}/${path}`, { disableGlob: true }));
}

function initFileGenerators(){
  webappHtmlIndexGenerator.init();
  webappIndexGenerator.init();
}

init();
