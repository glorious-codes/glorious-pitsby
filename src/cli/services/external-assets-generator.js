const path = require('path');
const assetsFilepathFilter = require('./assets-filepath-filter');
const { fileService } = require('./file');
const processService = require('./process');

const _public = {};

_public.init = config => {
  return Promise.all([
    copyAssets(config, assetsFilepathFilter.getRelative(config.styles)),
    copyAssets(config, assetsFilepathFilter.getRelative(config.scripts)),
    copyAssets(config, assetsFilepathFilter.getRelative(config.other))
  ]);
};

function copyAssets(config, filepaths){
  if(filepaths.length) return copyClientFilepathsContents(config, filepaths);
  return Promise.resolve();
}

function copyClientFilepathsContents(config, filepaths){
  return new Promise((resolve, reject) => {
    const resolutions = [];
    const clientDirectory = processService.getCwd();
    filepaths.forEach(filepath => {
      const target = path.join(getExternalAssetsDirectory(config, clientDirectory), filepath);
      fileService.copy(path.join(clientDirectory, filepath), target, () => {
        resolutions.push(filepath);
        if(resolutions.length === filepaths.length) resolve();
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  });
}

function getExternalAssetsDirectory({ outputDirectory }, clientDirectory){
  return path.join(clientDirectory, outputDirectory, 'external');
}

module.exports = _public;
