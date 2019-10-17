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
    const directory = buildOutputDirectoryPath(clientDirectory, outputDirectory);
    generateDocs(directory, config, err => {
      onDocsGenerationComplete(clientDirectory, err, resolve, reject);
    });
  });
};

function buildOutputDirectoryPath(clientDirectory, outputDirectory = './pitsby'){
  return path.join(clientDirectory, outputDirectory);
}

function generateDocs(directory, config, onComplete){
  const fullConfig = getCompilationConfig(directory, config);
  if(argsService.getCliArgs('--watch'))
    return compile(fullConfig, { shouldWatch: true, directory, onComplete });
  return compile(fullConfig, { onComplete });
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
  if(!shouldWatch)
    return webpack(config, onComplete);
  return serve(new Server(webpack(config), buildServerConfig(directory)), onComplete);
}

function serve(server, onSuccess){
  server.listen(getServerPort(), 'localhost', onSuccess);
}

function getServerPort(){
  return argsService.getCliArgs('--port') || DEFAULT_SERVER_PORT;
}

function buildServerConfig(directory){
  return {
    contentBase: directory,
    clientLogLevel: 'none',
    compress: true,
    host: '0.0.0.0',
    progress: true
  };
}

function onDocsGenerationComplete(clientDirectory, err, resolve, reject){
  return err ? reject(err) : resolve();
}

module.exports = _public;
