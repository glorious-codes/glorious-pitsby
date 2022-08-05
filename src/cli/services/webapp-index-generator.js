const path = require('path');
const { fileService } = require('./file');

const EXTERNAL_MODULE_NAME_PLACEHOLDER = '// inject:external-angular-module-name';

const _public = {};

_public.init = projects => {
  return new Promise((resolve, reject) => {
    fileService.write(
      path.join(__dirname, '../../webapp/scripts/index.js'),
      buildIndex(projects),
      resolve,
      reject
    );
  });
};

function buildIndex(projects){
  let template = getIndexTemplate();
  return projects && projects.length ?
    handleProjects(projects, template):
    removeAngularExternalModuleNamePlaceholderFromTemplate(template);
}

function handleProjects(projects, template){
  if(!containsAngularProject(projects))
    template = removeAngularExternalModuleNamePlaceholderFromTemplate(template);
  projects.forEach(project => {
    switch (project.engine) {
    case 'angular':
      template = registerAngularExternalModule(template, project.moduleName);
      break;
    case 'vue':
      template = registerVueExternalModule(template, project);
      break;
    }
  });
  return template;
}

function containsAngularProject(projects){
  for (var i = 0; i < projects.length; i++)
    if(projects[i].engine == 'angular')
      return true;
}

function registerAngularExternalModule(template, externalModuleName){
  return template.replace(
    EXTERNAL_MODULE_NAME_PLACEHOLDER, `, '${externalModuleName}'`
  );
}

function removeAngularExternalModuleNamePlaceholderFromTemplate(template){
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

function registerVueExternalModule(template, project){
  const lines = template.split('\n');
  lines.unshift(`Vue.use(window['${project.libraryName}']);`);
  lines.unshift('import Vue from \'vue\';');
  return lines.join('\n');
}

module.exports = _public;
