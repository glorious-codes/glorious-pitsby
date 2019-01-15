const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, collectFrom) => {
  return new Promise(resolve => {
    const pattern = buildCollectFromGlob(clientDirectory, collectFrom);
    collectComponents(pattern, components => {
      writeComponentsFile(components);
      resolve();
    });
  });
};

function buildCollectFromGlob(clientDirectory, collectFrom){
  return `${path.join(clientDirectory, collectFrom, './**/*.doc.js')}`;
}

function collectComponents(collectFromPattern, onCollectSuccess){
  fileService.collect(collectFromPattern, files => {
    onCollectSuccess(buildComponentsData(files));
  });
}

function buildComponentsData(files){
  return files.map(file => {
    const component = fileService.require(file);
    component.examples = stringifyExamplesFunctions(component.examples);
    return appendComponentId(component);
  });
}

function stringifyExamplesFunctions(examples = []){
  return examples.map(example => {
    example.data = stringifyFunctionsInExampleData(example.data);
    return example;
  });
}

function stringifyFunctionsInExampleData(data = {}){
  Object.keys(data).forEach(key => {
    if(typeof data[key] == 'function')
      data[key] = data[key].toString();
  });
  return data;
}

function appendComponentId(component){
  component.id = component.name.toLowerCase().replace(' ', '-').trim();
  return component;
}

function writeComponentsFile(components){
  const filepath = path.join(__dirname, '../../webapp/data/components.json');
  const data = JSON.stringify(components);
  fileService.write(filepath, data);
}

module.exports = _public;
