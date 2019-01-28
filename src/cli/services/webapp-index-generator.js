const path = require('path');
const { fileService } = require('./file');

const EXTERNAL_MODULE_NAME_PLACEHOLDER = '// inject:external-module-name';

const _public = {};

_public.init = externalModuleName => {
  fileService.write(
    path.join(__dirname, '../../webapp/scripts/index.js'),
    buildIndex(externalModuleName)
  );
};

function buildIndex(externalModuleName){
  let template = getIndexTemplate();
  return externalModuleName ?
    writeExternalModuleNameOnTemplate(template, externalModuleName) :
    removeExternalModuleNameLineFromTemplate(template);
}

function writeExternalModuleNameOnTemplate(template, externalModuleName){
  return template.replace(
    EXTERNAL_MODULE_NAME_PLACEHOLDER, `, '${externalModuleName}'`
  );
}

function removeExternalModuleNameLineFromTemplate(template){
  const lines = template.split('\n');
  lines.splice(getExternalModuleNameLineNumber(lines), 1);
  return lines.join('\n');
}

function getExternalModuleNameLineNumber(lines){
  for (var i = 0; i < lines.length; i++)
    if(lines[i].includes(EXTERNAL_MODULE_NAME_PLACEHOLDER))
      return i;
}

function getIndexTemplate(){
  return fileService.readSync(
    path.join(__dirname, '../../webapp/scripts/index-template.js')
  );
}

module.exports = _public;
