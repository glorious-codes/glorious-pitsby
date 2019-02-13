const path = require('path');
const argsService = require('./args');
const bundler = require('./bundler');
const webpackConfigBuilder = require('../../../webpack.conf.builder.js');

const _public = {};

_public.init = (clientDirectory, outputDirectory) => {
  const directory = buildOutputDirectoryPath(clientDirectory, outputDirectory);
  generateDocs(directory, onDocsGenerationComplete);
  console.log('Generating docs...');
};

function buildOutputDirectoryPath(clientDirectory, outputDirectory = './pitsby'){
  return path.join(clientDirectory, outputDirectory);
}

function generateDocs(directory, onDocsGenerationComplete){
  const config = webpackConfigBuilder.build(argsService.getCliArgs('--env'));
  config.output = { path: directory };
  bundler.compile(config, onDocsGenerationComplete);
}

function onDocsGenerationComplete(err){
  if(err)
    return console.log('Ops! Something went wrong...', err);
  return console.log('Docs successfully generated!');
}

module.exports = _public;
