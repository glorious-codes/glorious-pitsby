const docService = require('../services/doc');
const buildService = require('../services/build');

const _public = {};

_public.exec = options => {
  const option = getOption(options);
  if(docService.isHelpFlag(option))
    return docService.log('build');
  return buildService.init(options);
};

function getOption(options){
  return options ? options[0] : null;
}

module.exports = _public;
