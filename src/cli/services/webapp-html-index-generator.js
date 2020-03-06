const path = require('path');
const cdnService = require('./cdn');
const { fileService } = require('./file');
const assetsFilepathFilter = require('./assets-filepath-filter');
const webappHtmlIndexCustomisation = require('./webapp-html-index-customisation');

const _public = {};

_public.init = ({ scripts, styles, custom, projects = [] } = {}) => {
  return new Promise((resolve, reject) => {
    const linkTags = buildAssetTags(styles, buildLinkTag);
    const scriptTags = buildAssetTags(scripts, buildScriptTag);
    const indexHtml = webappHtmlIndexCustomisation.init(buildIndexHtml(
      linkTags,
      cdnService.buildAngularScriptTag(),
      handleExternalScriptTags(scriptTags, projects)
    ), custom);
    fileService.write(path.join(__dirname, '../../webapp/index.html'), indexHtml, resolve, reject);
  });
};

function buildAssetTags(paths = [], tagBuilderAction){
  const tags = [];
  paths.forEach(path => {
    tags.push(tagBuilderAction(path));
  });
  return tags;
}

function buildLinkTag(path){
  return `<link href="${buildExternalAssetPath(path)}?t=${Date.now()}" rel="stylesheet">`;
}

function buildScriptTag(path){
  return `<script src="${buildExternalAssetPath(path)}?t=${Date.now()}"></script>`;
}

function handleExternalScriptTags(scriptTags, projects){
  const vueConfig = getProjectEngineConfig(projects, 'vue');
  const reactConfig = getProjectEngineConfig(projects, 'react');
  if(vueConfig)
    scriptTags.unshift(cdnService.buildVueScriptTag(vueConfig.version));
  if(reactConfig)
    scriptTags.unshift(cdnService.buildReactScriptTag(reactConfig.version));
  return scriptTags;
}

function getProjectEngineConfig(projects, engine){
  return projects.find(project => project.engine == engine);
}

function buildExternalAssetPath(path){
  return assetsFilepathFilter.isRelativePath(path) ?
    `external/${parseRelativePath(path)}` :
    path;
}

function parseRelativePath(path){
  return path.indexOf('./') === 0 ? path.replace('./','') : path;
}

function buildIndexHtml(linkTags, angularScriptTag, externalScriptTags){
  const template = getIndexHtmlTemplate();
  let html = injectExternalTagsOnIndex(template, 'external-links', linkTags);
  html = injectExternalTagsOnIndex(html, 'angular', angularScriptTag);
  html = injectExternalTagsOnIndex(html, 'external-scripts', externalScriptTags);
  return clearBlankLines(html);
}

function injectExternalTagsOnIndex(indexHtml, tagType, tags){
  const html = Array.isArray(tags) ? tags.join('\n') : tags;
  return indexHtml.replace(`<!-- inject:${tagType} -->`, html);
}

function getIndexHtmlTemplate(){
  return fileService.readSync(
    path.join(__dirname, '../../webapp/index-template.html')
  );
}

function clearBlankLines(markup){
  return markup.replace(/^[\s]+$/gm, '');
}

module.exports = _public;
