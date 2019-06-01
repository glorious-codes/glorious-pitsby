const path = require('path');
const webpack = require('webpack');
const Server = require('webpack-dev-server');
const argsService = require('./args');
const { fileService } = require('./file');

const _public = {};

const DEFAULT_SERVER_PORT = 7000;

_public.init = (clientDirectory, outputDirectory) => {
  return new Promise((resolve, reject) => {
    console.log('Generating docs...');
    const directory = buildOutputDirectoryPath(clientDirectory, outputDirectory);
    generateDocs(directory, err => {
      onDocsGenerationComplete(err, resolve, reject);
    });
  });
};

function buildOutputDirectoryPath(clientDirectory, outputDirectory = './pitsby'){
  return path.join(clientDirectory, outputDirectory);
}

function generateDocs(directory, onSuccess){
  const config = getCompilationConfig(directory);
  if(argsService.getCliArgs('--watch'))
    return compile(config, { shouldWatch: true, directory, onSuccess });
  return compile(config, { onSuccess });
}

function getCompilationConfig(directory){
  let defaultConfig = getCompilationDefaultConfig(directory);
  if(argsService.getCliArgs('--watch'))
    defaultConfig = appendWebsocketConfig(defaultConfig, directory);
  return defaultConfig;
}

function getCompilationDefaultConfig(directory){
  const config = fileService.require('../../../webpack.config');
  config.output.path = directory;
  return config;
}

function appendWebsocketConfig(defaultConfig){
  defaultConfig.entry.unshift(`webpack-dev-server/client?http://localhost:${getServerPort()}/`);
  return defaultConfig;
}

function compile(config, { shouldWatch, directory, onSuccess }){
  if(!shouldWatch)
    return webpack(config, onSuccess);
  return serve(new Server(webpack(config), buildServerConfig(directory)), onSuccess);
}

function serve(server, onSuccess){
  const port = getServerPort();
  server.listen(port, 'localhost', () => {
    console.log(`Documentation successfully served on http://localhost:${port}`);
    onSuccess();
  });
}

function getServerPort(){
  return argsService.getCliArgs('--port') || DEFAULT_SERVER_PORT;
}

function buildServerConfig(directory){
  return {
    contentBase: directory,
    clientLogLevel: 'none',
    host: '0.0.0.0',
    progress: true,
    quiet: true
  };
}

function onDocsGenerationComplete(err, resolve, reject){
  if(err)
    return reject(err);
  console.log('Docs successfully generated!');
  return resolve();
}

module.exports = _public;
