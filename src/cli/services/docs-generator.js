const path = require('path');
const webpack = require('webpack');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, outputDirectory) => {
  const directory = buildOutputDirectoryPath(clientDirectory, outputDirectory);
  generateDocs(directory, onDocsGenerationComplete);
  fileService.console.log('Generating docs...');
};

function buildOutputDirectoryPath(clientDirectory, outputDirectory = './pitsby'){
  return path.join(clientDirectory, outputDirectory);
}

function generateDocs(directory, onDocsGenerationComplete){
  const config = fileService.require('../../../webpack.config.js');
  config.output = { path: directory };
  webpack(config, onDocsGenerationComplete);
}

function onDocsGenerationComplete(err){
  if(err)
    return fileService.console.log('Ops! Something went wrong...', err);
  return fileService.console.log('Docs successfully generated!');
}

module.exports = _public;
