const path = require('path');
const jsonService = require('./json');
const webappDataService = require('./webapp-data');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, projects = []) => {
  return new Promise(resolve => {
    projects.forEach((project, index) => {
      const pattern = buildCollectFromGlob(clientDirectory, project.collectDocsFrom);
      collectComponents(pattern, components => {
        writeComponentsFile(components, project.engine);
        if(index === projects.length - 1)
          resolve();
      });
    });
  });
};

function buildCollectFromGlob(clientDirectory, collectDocsFrom){
  return `${path.join(clientDirectory, collectDocsFrom, './**/*.doc.js')}`;
}

function collectComponents(collectDocsFromPattern, onCollectSuccess){
  fileService.collect(collectDocsFromPattern, files => {
    onCollectSuccess(buildComponentsData(files));
  });
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

function writeComponentsFile(components, engine){
  webappDataService.save(`components-${engine}`, components);
}

module.exports = _public;
