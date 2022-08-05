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

_public.copySingleFile = (filepath, config, onSuccess, onError) => {
  const clientDirectory = processService.getCwd();
  const targetDirectory = getExternalAssetsDirectory(clientDirectory, config);
  fileService.copy(
    path.join(clientDirectory, filepath),
    path.join(targetDirectory, filepath),
    onSuccess,
    onError
  );
};

function copyAssets(config, files){
  if(files.length) return copyMultipleFiles(config, files);
  return Promise.resolve();
}

function copyMultipleFiles(config, filepaths){
  return new Promise((resolve, reject) => {
    const resolutions = [];
    filepaths.forEach(filepath => {
      _public.copySingleFile(filepath, config, () => {
        resolutions.push(filepath);
        if(resolutions.length === filepaths.length) resolve();
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  });
}

function getExternalAssetsDirectory(clientDirectory, { outputDirectory }){
  return path.join(clientDirectory, outputDirectory, 'external');
}

module.exports = _public;
