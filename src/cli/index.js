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
  const assets = getExternalAssets(config);
  generateExternalComponentsData(clientDirectory, config.collectFrom);
  generateExternalAssets(clientDirectory, assets);
  generateWebappHtmlIndex(clientDirectory, assets);
  generateWebappIndex(clientDirectory, config.moduleName);
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

function getExternalAssets(config){
  return {
    styles: config.styles,
    scripts: config.scripts
  };
}

function generateWebappHtmlIndex(clientDirectory, externalAssets){
  webappHtmlIndexGenerator.init(clientDirectory, externalAssets);
}

function generateWebappIndex(clientDirectory, moduleName){
  webappIndexGenerator.init(clientDirectory, moduleName);
}

_public.init();

module.exports = _public;
