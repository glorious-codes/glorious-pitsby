const path = require('path');
const liveServer = require('live-server');
const argsService = require('./args');
const configService = require('./config');
const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const docsGenerator = require('./docs-generator');
const processService = require('./process');
const watchService = require('./watch');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');

const _public = {};

_public.init = () => {
  const config = configService.get();
  return generateExternalFiles(config).then(() => {
    return generateWebappFiles(config).then(() => {
      return docsGenerator.init(config).then(() => {
        if(argsService.getCliArgs('--watch')) serve(config);
      });
    });
  });
};

function generateExternalFiles(config){
  return Promise.all([
    externalAssetsGenerator.init(config),
    externalComponentsDataGenerator.init(config.projects)
  ]);
}

function generateWebappFiles(config){
  return Promise.all([
    webappHtmlIndexGenerator.init(config),
    webappIndexGenerator.init(config.projects)
  ]);
}

function serve(config){
  const port = getServerPort();
  liveServer.start({
    host: '0.0.0.0',
    root: path.join(processService.getCwd(), config.outputDirectory),
    open: false,
    file: 'index.html',
    noCssInject: true,
    logLevel: 0,
    port,
  });
  console.log(`Docs served on http://localhost:${port}`);
  watchService.init(config);
}

function getServerPort(){
  return argsService.getCliArgs('--port') || 7000;
}

module.exports = _public;
