const path = require('path');
const webpack = require('webpack');
const logger = require('./logger');
const processService = require('./process');
const { fileService } = require('./file');

const _public = {};

_public.init = config => {
  return new Promise((resolve, reject) => {
    logger.msg('Generating docs...');
    webpack(buildWebpackConfig(config), err => {
      if(err) return reject(err);
      logger.msg('Docs successfully generated!', { theme: 'success' });
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
