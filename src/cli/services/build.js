const externalProjectsDataGenerator = require('./external-projects-data-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalAssetsGenerator = require('./external-assets-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const docsGenerator = require('./docs-generator');
const configService = require('./config');

const _public = {};

_public.init = () => {
  const clientDirectory = process.cwd();
  const config = configService.get(clientDirectory);
  return generateExternalFiles(clientDirectory, config).then(() => {
    return generateWebappIndexes(config).then(() => {
      return docsGenerator.init(clientDirectory, config.outputDirectory);
    });
  });
};

function generateExternalFiles(clientDirectory, config){
  return Promise.all([
    generateExternalProjectsData(config.projects),
    generateExternalComponentsData(clientDirectory, config.projects),
    generateExternalAssets(clientDirectory, getExternalAssets(config))
  ]);
}

function generateExternalProjectsData(projects){
  return externalProjectsDataGenerator.init(projects);
}

function generateExternalComponentsData(clientDirectory, collectFrom){
  return externalComponentsDataGenerator.init(clientDirectory, collectFrom);
}

function generateExternalAssets(clientDirectory, externalAssets){
  return externalAssetsGenerator.init(clientDirectory, externalAssets);
}

function generateWebappIndexes(config){
  return Promise.all([
    webappHtmlIndexGenerator.init(getExternalAssets(config), config.projects),
    webappIndexGenerator.init(config.projects)
  ]);
}

function getExternalAssets(config){
  return {
    styles: config.styles,
    scripts: config.scripts,
    other: config.other
  };
}

module.exports = _public;
