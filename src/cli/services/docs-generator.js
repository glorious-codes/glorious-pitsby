const path = require('path');
const webpack = require('webpack');
const Server = require('webpack-dev-server');
const argsService = require('./args');
const webappIndexGenerator = require('./webapp-index-generator');
const { fileService } = require('./file');

const _public = {};

const DEFAULT_SERVER_PORT = 7000;

_public.init = (clientDirectory, config) => {
  const { outputDirectory } = config;
  return new Promise((resolve, reject) => {
    console.log('Generating docs...');
    const directory = buildOutputDirectoryPath(clientDirectory, outputDirectory);
    generateDocs(directory, {
      config,
      onComplete: err => onDocsGenerationComplete(clientDirectory, err, resolve, reject)
    });
  });
};

function buildOutputDirectoryPath(clientDirectory, outputDirectory = './pitsby'){
  return path.join(clientDirectory, outputDirectory);
}

function generateDocs(directory, { config, onComplete }){
  const fullConfig = getCompilationConfig(directory, config);
  const shouldWatch = argsService.getCliArgs('--watch');
  const baseOptions = { onComplete };
  const customOptions = shouldWatch && { shouldWatch, directory };
  return compile(fullConfig, { ...baseOptions, ...customOptions });
}

function getCompilationConfig(directory, config){
  let defaultConfig = getCompilationDefaultConfig(directory, config);
  if(argsService.getCliArgs('--watch'))
    defaultConfig = appendWebsocketConfig(defaultConfig, directory);
  return defaultConfig;
}

function getCompilationDefaultConfig(directory, config){
  const vueProject = findVueProject(config);
  const baseConfig = fileService.require('../../../webpack.config');
  baseConfig.output.path = directory;
  if(vueProject)
    baseConfig.externals[`${buildExternalVueComponentsPath(vueProject.importFrom)}`] = vueProject.libraryName;
  return baseConfig;
}

function findVueProject(config){
  return config.projects.find(project => project.engine == 'vue');
}

function buildExternalVueComponentsPath(importFrom){
  return webappIndexGenerator.buildVueExternalModuleImportPath(importFrom);
}

function appendWebsocketConfig(defaultConfig){
  defaultConfig.entry.unshift(`webpack-dev-server/client?http://localhost:${getServerPort()}/`);
  return defaultConfig;
}

function compile(config, { shouldWatch, directory, onComplete }){
  if(!shouldWatch) return webpack(config, onComplete);
  return serve(new Server(buildServerConfig(directory), webpack(config)), onComplete);
}

function serve(server, onSuccess){
  server.startCallback(() => {
    console.log(`Documentation successfully served on http://localhost:${getServerPort()}`);
    onSuccess();
  });
}

function buildServerConfig(directory){
  return {
    static: { directory, watch: true },
    client: { overlay: false },
    host: '0.0.0.0',
    compress: true,
    port: getServerPort(),
    hot: false
  };
}

function getServerPort(){
  return argsService.getCliArgs('--port') || DEFAULT_SERVER_PORT;
}

function onDocsGenerationComplete(clientDirectory, err, resolve, reject){
  if(err) return reject(err);
  console.log('Docs successfully generated!');
  return resolve();
}

module.exports = _public;
