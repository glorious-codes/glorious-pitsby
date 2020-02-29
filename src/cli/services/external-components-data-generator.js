const path = require('path');
const jsonService = require('./json');
const jsxJsonService = require('./jsx-json');
const moduleService = require('./module');
const webappDataService = require('./webapp-data');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, projects = []) => {
  return new Promise((resolve, reject) => {
    const fulfillments = [];
    projects.forEach(project => {
      const pattern = buildCollectFromGlob(clientDirectory, project.collectDocsFrom);
      collectComponents(pattern, project, components => {
        writeComponentsFile(project.engine, components, () => {
          fulfillments.push(project);
          if(fulfillments.length === projects.length)
            resolve();
        }, reject);
      }, reject);
    });
  });
};

function buildCollectFromGlob(clientDirectory, collectDocsFrom){
  return `${path.join(clientDirectory, collectDocsFrom, './**/*.doc.js')}`;
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
