const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, externalModuleName) => {
  fileService.write(
    path.join(__dirname, '../../webapp/scripts/index.js'),
    buildIndex(externalModuleName)
  );
};

function buildIndex(externalModuleName = ''){
  const template = getIndexTemplate();
  return template.replace(
    '// inject:external-module-name', `'${externalModuleName}'`
  );
}

function getIndexTemplate(){
  return fileService.readSync(
    path.join(__dirname, '../../webapp/scripts/index-template.js')
  );
}

module.exports = _public;