#!/usr/bin/env node

const externalAssetsGenerator = require('./services/external-assets-generator');
const externalComponentsDataGenerator = require('./services/external-components-data-generator');
const webappHtmlIndexGenerator = require('./services/webapp-html-index-generator');
const webappIndexGenerator = require('./services/webapp-index-generator');
const { fileService } = require('./services/file');

const _public = {};

_public.init = () => {
  const clientDirectory = process.cwd();
  const config = getPitsbyConfig(clientDirectory);
  generateExternalFiles(clientDirectory, config);
  generateWebappHtmlIndex(clientDirectory, config);
  generateWebappIndex(clientDirectory, config.moduleName);
};

function generateExternalFiles(clientDirectory, config){
  generateExternalComponentsData(clientDirectory, config.collectFrom);
  generateExternalAssets(clientDirectory, getExternalAssets(config));
}

function getPitsbyConfig(clientDirectory){
  return fileService.readJSONSync(`${clientDirectory}/pitsby.json`);
}

function generateExternalComponentsData(clientDirectory, collectFrom){
  externalComponentsDataGenerator.init(clientDirectory, collectFrom);
}

function generateExternalAssets(clientDirectory, externalAssets){
  externalAssetsGenerator.init(clientDirectory, externalAssets);
}

function generateWebappHtmlIndex(clientDirectory, config){
  webappHtmlIndexGenerator.init(clientDirectory, getExternalAssets(config));
}

function generateWebappIndex(clientDirectory, moduleName){
  webappIndexGenerator.init(clientDirectory, moduleName);
}

function getExternalAssets(config){
  return {
    styles: config.styles,
    scripts: config.scripts
  };
}

_public.init();

module.exports = _public;
