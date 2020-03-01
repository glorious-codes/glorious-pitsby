const pkg = require('../../../package.json');
const processService = require('./process');

const _public = {};

_public.buildAngularScriptTag = () => {
  return buildEngineScriptTag('angular.js', getAngularVersion());
};

_public.buildReactScriptTag = (version = '16.13.0') => {
  return [
    buildReactScriptTag(version, 'react'),
    buildReactScriptTag(version, 'react-dom')
  ].join('\n');
};

_public.buildVueScriptTag = (version = '2.5.13') => {
  return buildEngineScriptTag('vue', version);
};

function getAngularVersion(){
  return pkg.devDependencies.angular.replace('^', '');
}

function buildEngineScriptTag(engine, version){
  const cdnUrl = `https://cdnjs.cloudflare.com/ajax/libs/${engine}`;
  const file = buildEngineFileName(engine);
  return `<script src="${cdnUrl}/${version}/${file}"></script>`;
}

function buildEngineFileName(engine){
  const suffix = processService.getNodeEnv() == 'production' ? '.min.js' : '.js';
  return `${engine.replace('.js', '')}${suffix}`;
}

function buildReactScriptTag(version, lib){
  const filename = buildReactLibFilename(lib);
  const cdnUrl = `https://unpkg.com/${lib}@${version}/umd/${filename}`;
  return `<script crossorigin src="${cdnUrl}"></script>`;
}

function buildReactLibFilename(lib){
  const suffix = processService.getNodeEnv() == 'production' ? 'production.min' : 'development';
  return `${lib}.${suffix}.js`;
}

module.exports = _public;
