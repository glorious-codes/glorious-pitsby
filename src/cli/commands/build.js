const docService = require('../services/doc');
const buildService = require('../services/build');

const _public = {};

_public.exec = options => {
  const option = getOption(options);
  if(docService.isHelpFlag(option))
    return docService.log('build');
  if(isValidOption(option))
    return buildService.init(options);
  return docService.logUnknownOption('build', option);
};

function getOption(options){
  return options ? options[0] : null;
}

function isValidOption(option){
  return !option || ['-w', '--watch', '--env'].includes(getOptionName(option));
}

function getOptionName(option){
  return option.split('=')[0];
}

module.exports = _public;
