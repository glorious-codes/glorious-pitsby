const path = require('path');
const processService = require('./process');
const jsonService = require('./json');
const jsxJsonService = require('./jsx-json');
const moduleService = require('./module');
const webappDataService = require('./webapp-data');
const { fileService } = require('./file');

const _public = {};

_public.init = (projects = []) => {
  if(!projects.length) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const resolutions = [];
    projects.forEach(project => _public.buildComponentsDataByProject(project, () => {
      resolutions.push(project);
      if(resolutions.length === projects.length) resolve();
    }, reject));
  });
};

_public.buildComponentsDataByProject = (project, onSuccess, onError) => {
  const glob = buildCollectFromGlob(project.collectDocsFrom);
  collectComponents(glob, project, componentsData => {
    writeComponentsFile(project.engine, componentsData, onSuccess, onError);
  }, onError);
};

function buildCollectFromGlob(collectDocsFrom){
  return path.join(processService.getCwd(), collectDocsFrom, './**/*.doc.js');
}

function collectComponents(collectDocsFromPattern, project, onSuccess, onError){
  fileService.collect(collectDocsFromPattern, filepaths => {
    onSuccess(buildComponentsData(project, filepaths));
  }, onError);
}

function buildComponentsData(project, filepaths){
  return filepaths.map(filepath => {
    delete require.cache[filepath];
    const component = parseComponentFile(project, filepath);
    return appendComponentId(component);
  });
}

function parseComponentFile(project, filepath){
  return project.engine == 'react' ?
    moduleService.compileInMemoryModule(jsxJsonService.stringifyFunctions(filepath)) :
    jsonService.stringifyFunctions(fileService.require(filepath));
}

function appendComponentId(component){
  component.id = component.name.toLowerCase().replace(/\s+/g, '-').trim();
  return component;
}

function writeComponentsFile(engine, data, onSuccess, onError){
  webappDataService.save(`components-${engine}.json`, data, onSuccess, onError);
}

module.exports = _public;
