const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalAssetsGenerator = require('./external-assets-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const docsGenerator = require('./docs-generator');
const { fileService } = require('./file');

const _public = {};

_public.init = () => {
  const clientDirectory = process.cwd();
  const config = getPitsbyConfig(clientDirectory);
  generateExternalFiles(clientDirectory, config).then(() => {
    generateWebappIndexes(config);
    docsGenerator.init(clientDirectory, config.outputDirectory);
  }, err => { console.log(err); });
};

function getPitsbyConfig(clientDirectory){
  return fileService.readJSONSync(`${clientDirectory}/pitsby.json`);
}

function generateExternalFiles(clientDirectory, config){
  return Promise.all([
    generateExternalComponentsData(clientDirectory, config.collectFrom),
    generateExternalAssets(clientDirectory, getExternalAssets(config))
  ]);
}

function generateExternalComponentsData(clientDirectory, collectFrom){
  externalComponentsDataGenerator.init(clientDirectory, collectFrom);
}

function generateExternalAssets(clientDirectory, externalAssets){
  externalAssetsGenerator.init(clientDirectory, externalAssets);
}

function generateWebappIndexes(config){
  webappHtmlIndexGenerator.init(getExternalAssets(config));
  webappIndexGenerator.init(config.moduleName);
}

function getExternalAssets(config){
  return {
    styles: config.styles,
    scripts: config.scripts,
    other: config.other
  };
}

module.exports = _public;
