const chokidar = require('chokidar');
const path = require('path');
const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const processService = require('./process');

const _public = {};

_public.init = (config = {}) => {
  const files = buildFilepathsToWatch(config);
  const cwd = processService.getCwd();
  if(files.length) {
    chokidar.watch(files, { cwd }).on('change', filepath => handleChange(filepath, config));
    console.log('Watching for changes...');
  }
};

function buildFilepathsToWatch({ projects = [], styles = [], scripts = [], other = [] }){
  return [
    ...buildDocumentationFilepathGlobs(projects),
    ...styles,
    ...scripts,
    ...other,
  ];
}

function buildDocumentationFilepathGlobs(projects){
  return projects.map(({ collectDocsFrom }) => `${collectDocsFrom}/**/*.doc.js`);
}

function handleChange(filepath, config){
  console.log(`${path.basename(filepath)} changed`);
  const update = getUpdateActionAccordingToChangedFile(filepath, config);
  update && update();
}

function getUpdateActionAccordingToChangedFile(filepath, config){
  if(isDocumentationFile(filepath)) return buildUpdateDocumentationAction(filepath, config);
  return buildUpdateAssetAction(filepath, config);
}

function isDocumentationFile(filepath){
  const regex = new RegExp(/\.doc\.js$/);
  return regex.test(filepath);
}

function buildUpdateDocumentationAction(filepath, config){
  const project = identifyChangeProjectByDocumentationFilepath(filepath, config);
  if(project) {
    return () => {
      externalComponentsDataGenerator.buildComponentsDataByProject(
        project,
        () => console.log('Docs updated!'),
        err => console.log(err)
      );
    };
  }
}

function identifyChangeProjectByDocumentationFilepath(filepath, config){
  return config.projects.find(({ collectDocsFrom }) => {
    return filepath.includes(collectDocsFrom.replace(/^\.\//, ''));
  });
}

function buildUpdateAssetAction(filepath, config){
  return () => {
    externalAssetsGenerator.copySingleFile(
      filepath,
      config,
      () => console.log('Asset updated!'),
      err => console.log(err)
    );
  };
}

module.exports = _public;
