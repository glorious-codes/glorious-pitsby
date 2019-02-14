const path = require('path');
const webpack = require('webpack');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, outputDirectory) => {
  console.log('Generating docs...');
  const directory = buildOutputDirectoryPath(clientDirectory, outputDirectory);
  generateDocs(directory, onDocsGenerationComplete);
};

function buildOutputDirectoryPath(clientDirectory, outputDirectory = './pitsby'){
  return path.join(clientDirectory, outputDirectory);
}

function generateDocs(directory, onDocsGenerationComplete){
  const config = fileService.require('../../../webpack.config');
  config.output.path = directory;
  webpack(config, onDocsGenerationComplete);
}

function onDocsGenerationComplete(err){
  if(err)
    return console.log('Ops! Something went wrong...', err);
  return console.log('Docs successfully generated!');
}

module.exports = _public;
