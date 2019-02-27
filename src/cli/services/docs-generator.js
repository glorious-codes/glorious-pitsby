const path = require('path');
const webpack = require('webpack');
const { fileService } = require('./file');

const _public = {};

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

function generateDocs(directory, onDocsGenerationComplete){
  const config = fileService.require('../../../webpack.config');
  config.output.path = directory;
  webpack(config, onDocsGenerationComplete);
}

function onDocsGenerationComplete(err, resolve, reject){
  removeWebappExternalDirectories();
  if(err)
    return reject(err);
  console.log('Docs successfully generated!');
  return resolve();
}

function removeWebappExternalDirectories(){
  const webappBasePath = path.join(__dirname, '../../webpapp');
  ['data', 'external'].forEach(directory => {
    fileService.remove(`${webappBasePath}/${directory}`);
  });
}

module.exports = _public;
