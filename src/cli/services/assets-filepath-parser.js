const _public = {};

_public.parse = filepath => {
  return typeof filepath == 'string' ? filepath : parseFilepath(filepath);
};

function parseFilepath(path){
  return path.src || path.href;
}

module.exports = _public;
