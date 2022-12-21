const assetsFilepathParser = require('./assets-filepath-parser');

const _public = {};

_public.getRelative = (filepaths = []) => {
  return filepaths.filter(filepath => {
    return !startsWithHttp(assetsFilepathParser.parse(filepath));
  });
};

_public.isRelativePath = filepath => {
  return !startsWithHttp(filepath);
};

function startsWithHttp(path){
  return path.indexOf('http') === 0;
}

module.exports = _public;
