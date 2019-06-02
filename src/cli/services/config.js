const { fileService } = require('./file');

const _public = {};

_public.get = clientDirectory => {
  const config = getPitsbyConfig(clientDirectory);
  if(!config)
    return console.error('No pitsby.config.js has been found.');
  return normalizeEngineCase(normalizeConfig(config));
};

function getPitsbyConfig(clientDirectory){
  const config =  getConfig(clientDirectory, 'pitsby.config.js') ||
                  getConfig(clientDirectory, 'pitsby.js') ||
                  getConfig(clientDirectory, 'pitsby.json');
  handleDeprecatedConfigFilenames(config);
  return config;
}

function getConfig(clientDirectory, filename){
  let config;
  try {
    config = fileService.require(`${clientDirectory}/${filename}`);
  }
  /* eslint-disable no-empty */
  catch(err) {}
  if(config)
    config.filename = filename;
  return config;
}

function handleDeprecatedConfigFilenames({ filename } = {}){
  if(isDeprecatedConfigFilename(filename))
    logDeprecatedConfigFilenameWarning(filename);
}

function isDeprecatedConfigFilename(filename){
  return ['pitsby.js', 'pitsby.json'].includes(filename);
}

function logDeprecatedConfigFilenameWarning(filename){
  console.warn(`${filename} is deprecated. Prefer to use pitsby.config.js as config filename.`);
}

function normalizeConfig(config){
  return config.moduleName ? pushAngularConfigToProjects(config) : config;
}

function normalizeEngineCase(config){
  if(config.projects)
    config.projects.forEach(project => {
      project.engine = project.engine.toLowerCase();
    });
  return config;
}

function pushAngularConfigToProjects(config){
  config.projects = config.projects || [];
  config.projects.push({
    engine: 'angular',
    collectDocsFrom: config.collectFrom,
    moduleName: config.moduleName
  });
  return config;
}

module.exports = _public;
