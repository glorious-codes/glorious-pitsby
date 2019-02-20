const path = require('path');
const webpack = require('webpack');
const Server = require('webpack-dev-server');
const argsService = require('./args');
const { fileService } = require('./file');

const _public = {};

const SERVER_PORT = 7000;

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
    return compile(config, { shouldWatch: true });
  return compile(config, { onSuccess });
}

function getCompilationConfig(directory){
  const config = fileService.require('../../../webpack.config');
  config.output.path = directory;
  if(argsService.getCliArgs('--watch')) {
    config.entry.unshift(`webpack-dev-server/client?http://localhost:${SERVER_PORT}/`)
    config.devServer = { contentBase: directory, host: '0.0.0.0', hot: true };
  }
  return config;
}

function compile(config, { onSuccess, shouldWatch }){
  if(shouldWatch)
    return new Server(webpack(config)).listen(SERVER_PORT);
  return webpack(config, onDocsGenerationComplete);
}

function onDocsGenerationComplete(err, resolve, reject){
  removeWebappExternalDirectories();
  if(err)
    return reject(err);
  console.log('Docs successfully generated!');
  return resolve();
}

module.exports = _public;
