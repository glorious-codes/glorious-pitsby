const argsService = require('./args');
const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalMetricsIdsModuleGenerator = require('./external-metrics-ids-module-generator');
const externalProjectsDataGenerator = require('./external-projects-data-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const docsGenerator = require('./docs-generator');
const watchService = require('./watch');
const configService = require('./config');

const _public = {};

_public.init = ({ isWatching } = {}) => {
  if(isWatching)
    console.log('Updating docs...');
  const clientDirectory = process.cwd();
  const config = configService.get(clientDirectory);
  return generateExternalFiles(clientDirectory, config).then(() => {
    return generateWebappIndexes(config).then(() => {
      return generateDocs(clientDirectory, config, isWatching);
    });
  });
};

function generateExternalFiles(clientDirectory, config){
  return Promise.all([
    generateExternalProjectsData(config.projects),
    generateExternalComponentsData(clientDirectory, config.projects),
    generateExternalAssets(clientDirectory, getExternalAssets(config)),
    generateMetricsIdsModule(config.metrics)
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

function generateMetricsIdsModule(metrics){
  return externalMetricsIdsModuleGenerator.init(metrics);
}

function generateWebappIndexes(config){
  return Promise.all([
    webappHtmlIndexGenerator.init(getExternalAssets(config), config.projects),
    webappIndexGenerator.init(config.projects)
  ]);
}

function generateDocs(clientDirectory, config, isWatching){
  if(isWatching)
    return true;
  return docsGenerator.init(clientDirectory, config.outputDirectory).then(() => {
    return handleWatch(clientDirectory, getExternalAssets(config), argsService.getCliArgs('--watch'));
  });
}

function handleWatch(clientDirectory, externalAssets, shouldWatch){
  if(shouldWatch)
    watchService.init(getFilesToWatch(clientDirectory, externalAssets), () => {
      return _public.init({ isWatching: true });
    });
  return true;
}

function getFilesToWatch(clientDirectory, assets){
  let files = [`${clientDirectory}/pitsby.js`, `${clientDirectory}/**/*.doc.js`];
  Object.keys(assets).forEach(asset => {
    if(assets[asset])
      files = files.concat(assets[asset]);
  });
  return files;
}

function getExternalAssets(config){
  return {
    styles: config.styles,
    scripts: config.scripts,
    other: config.other
  };
}

module.exports = _public;
