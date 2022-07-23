const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const externalMetricsIdsModuleGenerator = require('./src/cli/services/external-metrics-ids-module-generator');
const webappHtmlIndexGenerator = require('./src/cli/services/webapp-html-index-generator');
const webappIndexGenerator = require('./src/cli/services/webapp-index-generator');
const webappLogoGenerator = require('./src/cli/services/webapp-logo-generator');

function init(){
  const basepath = './src/webapp';
  const directories = ['data', 'external'];
  const files = ['index.html', 'scripts/index.js', 'scripts/components/logo/logo.html'];
  removeAssets(basepath, directories.concat(files));
  createDirectories(basepath, directories);
  initFileGenerators();
}

function removeAssets(basepath, assetPaths, onComplete){
  assetPaths.forEach(path => rimraf.sync(`${basepath}/${path}`, { disableGlob: true }));
}

function createDirectories(basepath, directories){
  directories.forEach(directory => createDirectory(`${basepath}/${directory}`));
  fs.writeFileSync(path.join(__dirname, `${basepath}/external/.gitkeep`), '');
}

function initFileGenerators(){
  externalMetricsIdsModuleGenerator.init();
  webappHtmlIndexGenerator.init();
  webappIndexGenerator.init();
  webappLogoGenerator.init({});
}

function createDirectory(directoryPath){
  fs.mkdirSync(path.join(__dirname, directoryPath));
}

init();
