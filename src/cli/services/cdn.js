const pkg = require('../../../package.json');
const processService = require('./process');

const _public = {};

_public.buildAngularScriptTag = () => {
  return buildEngineScriptTag(getAngularCdnUrl(), 'angular', getAngularVersion());
};

_public.buildReactScriptTag = (version = '16.13.0') => {
  return [
    buildReactScriptTag(version, 'react'),
    buildReactScriptTag(version, 'react-dom')
  ].join('\n');
};

_public.buildVueScriptTag = (version = '2.5.13') => {
  return buildEngineScriptTag(getVueCdnUrl(), 'vue', version);
};

function buildEngineScriptTag(cdnUrl, engine, version){
  const filename = buildEngineFileName(engine);
  return `<script src="${cdnUrl}/${version}/${filename}"></script>`;
}

function getAngularCdnUrl(){
  return 'https://ajax.googleapis.com/ajax/libs/angularjs';
}

function getVueCdnUrl(){
  return 'https://cdnjs.cloudflare.com/ajax/libs/vue';
}

function getAngularVersion(){
  return pkg.devDependencies.angular.replace('^', '');
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
