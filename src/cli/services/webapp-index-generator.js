const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.init = externalModuleName => {
  fileService.write(
    path.join(__dirname, '../../webapp/scripts/index.js'),
    buildIndex(externalModuleName)
  );
};

function buildIndex(externalModuleName = ''){
  let template = getIndexTemplate();
  template = template.replace(
    '// inject:external-module-name', `'${externalModuleName}'`
  );
  return template;
}

function getIndexTemplate(){
  return fileService.readSync(
    path.join(__dirname, '../../webapp/scripts/index-template.js')
  );
}

module.exports = _public;
