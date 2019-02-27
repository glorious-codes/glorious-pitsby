const path = require('path');
const jsonService = require('./json');
const webappDataService = require('./webapp-data');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, projects = []) => {
  return new Promise((resolve, reject) => {
    const fulfillments = [];
    projects.forEach(project => {
      const pattern = buildCollectFromGlob(clientDirectory, project.collectDocsFrom);
      collectComponents(pattern, components => {
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

function collectComponents(collectDocsFromPattern, onSuccess, onError){
  fileService.collect(collectDocsFromPattern, files => {
    onSuccess(buildComponentsData(files));
  }, onError);
}

function buildComponentsData(files){
  return files.map(file => {
    const component = jsonService.stringifyFunctions(fileService.require(file));
    return appendComponentId(component);
  });
}

function appendComponentId(component){
  component.id = component.name.toLowerCase().replace(' ', '-').trim();
  return component;
}

function writeComponentsFile(engine, data, onSuccess, onError){
  webappDataService.save(`components-${engine}`, data, onSuccess, onError);
}

module.exports = _public;
