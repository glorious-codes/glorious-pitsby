const { fileService } = require('./file');
const processService = require('./process');

const _public = {};

const DEFAULT_CONFIG = { outputDirectory: './pitsby' };

let cache;

_public.get = () => {
  if(cache) return cache;
  const config = getPitsbyConfig(process.cwd());
  if(!config) return console.error('No pitsby.config.js has been found.');
  return handleCache({ ...DEFAULT_CONFIG, ...normalizeEngineCase(normalizeConfig(config)) });
};

_public.flushCache = () => {
  cache = null;
};

function handleCache(config){
  cache = config;
  return config;
}

function getPitsbyConfig(){
  const config = lookupForConfig();
  handleDeprecatedConfigFilenames(config);
  return config;
}

function lookupForConfig(){
  const config = ['pitsby.config.js', 'pitsby.config.cjs', 'pitsby.js', 'pitsby.json'].reduce((result, filename) => {
    return result || getConfigByFilename(filename);
  }, '');
  if(config) return config;
}

function getConfigByFilename(filename){
  let config;
  try {
    config = fileService.require(`${processService.getCwd()}/${filename}`);
  }
  /* eslint-disable no-empty */
  catch(err) {}
  if(config) return { ...config, filename };
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
  return {
    ...config,
    projects: getProjetsFromConfig(config).map(project => ({ ...project, engine: project.engine.toLowerCase() }))
  };
}

function pushAngularConfigToProjects(config){
  return {
    ...config,
    projects: [
      ...getProjetsFromConfig(config),
      {
        engine: 'angular',
        collectDocsFrom: config.collectFrom,
        moduleName: config.moduleName
      }
    ]
  };
}

function getProjetsFromConfig(config){
  return config.projects || [];
}

module.exports = _public;
