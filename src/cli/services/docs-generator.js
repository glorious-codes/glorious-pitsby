const path = require('path');
const webpack = require('webpack');
const processService = require('./process');
const { fileService } = require('./file');

const _public = {};

_public.init = config => {
  return new Promise((resolve, reject) => {
    console.log('Generating docs...');
    webpack(buildWebpackConfig(config), err => {
      if(err) return reject(err);
      console.log('Docs successfully generated!');
      resolve();
    });
  });
};

function buildWebpackConfig(config){
  const baseConfig = fileService.require('../../../webpack.config');
  const output = { ...baseConfig.output, path: buildOutputDirectoryPath(config) };
  return { ...baseConfig, output };
}

function buildOutputDirectoryPath({ outputDirectory }){
  const clientDirectory = processService.getCwd();
  return path.join(clientDirectory, outputDirectory);
}

module.exports = _public;
