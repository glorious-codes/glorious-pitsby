const path = require('path');
const assetsFilepathFilter = require('./assets-filepath-filter');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, assets) => {
  return Promise.all([
    copyAssets(clientDirectory, assetsFilepathFilter.getRelative(assets.styles)),
    copyAssets(clientDirectory, assetsFilepathFilter.getRelative(assets.scripts)),
    copyAssets(clientDirectory, assetsFilepathFilter.getRelative(assets.other))
  ]);
};

function copyAssets(clientDirectory, filepaths){
  return filepaths && filepaths.length ?
    copyClientFilepathsContents(clientDirectory, filepaths) :
    Promise.resolve();
}

function copyClientFilepathsContents(clientDirectory, filepaths){
  return new Promise((resolve, reject) => {
    let successfulCopies = 0;
    filepaths.forEach(filepath => {
      const target = path.join(getExternalAssetsDirectory(), filepath);
      fileService.copy(path.join(clientDirectory, filepath), target, () => {
        successfulCopies++;
        if(successfulCopies === filepaths.length)
          resolve();
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  });
}

function getExternalAssetsDirectory(){
  return path.join(__dirname, '../../webapp/external');
}

module.exports = _public;
