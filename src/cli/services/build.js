const argsService = require('./args');
const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalMetricsIdsModuleGenerator = require('./external-metrics-ids-module-generator');
const externalProjectsDataGenerator = require('./external-projects-data-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const webappLogoGenerator = require('./webapp-logo-generator');
const docsGenerator = require('./docs-generator');
const watchService = require('./watch');
const configService = require('./config');

const _public = {};

_public.init = ({ isWatching } = {}) => {
  if(isWatching) console.log('Updating docs...');
  const clientDirectory = process.cwd();
  const config = configService.get();
  return generateExternalFiles(config).then(() => {
    return generateWebappFiles(config).then(() => {
      return generateDocs(clientDirectory, config, isWatching);
    });
  });
};

function generateExternalFiles(config){
  return Promise.all([
    externalProjectsDataGenerator.init(config.projects),
    externalComponentsDataGenerator.init(config.projects),
    externalAssetsGenerator.init(config),
    externalMetricsIdsModuleGenerator.init(config.metrics)
  ]);
}

function generateWebappFiles(config){
  return Promise.all([
    webappHtmlIndexGenerator.init(config),
    webappLogoGenerator.init(config.custom),
    webappIndexGenerator.init(config.projects)
  ]);
}

function generateDocs(clientDirectory, config, isWatching){
  if(isWatching) return true;
  return docsGenerator.init(clientDirectory, config).then(() => {
    const shouldWatch = argsService.getCliArgs('--watch');
    return shouldWatch && watch(getFilesToWatch(clientDirectory, getExternalAssets(config)));
  });
}

function getFilesToWatch(clientDirectory, assets){
  let files = [`${clientDirectory}/pitsby.config.js`, `${clientDirectory}/**/*.doc.js`];
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

function watch(filesToWatch){
  watchService.init(filesToWatch, () => _public.init({ isWatching: true }));
}

module.exports = _public;
