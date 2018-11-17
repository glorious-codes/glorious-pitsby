const path = require('path');
const { fileService } = require('./file');
const assetsFilepathFilter = require('./assets-filepath-filter');

const _public = {};

_public.init = (clientDirectory, options = {}) => {
  const linkTags = buildAssetTags(options.styles, buildLinkTag);
  const scriptTags = buildAssetTags(options.scripts, buildScriptTag);
  const indexHtml = buildIndexHtml(linkTags, scriptTags, buildAngularScriptTag());
  fileService.write(path.join(__dirname, '../../webapp/index.html'), indexHtml);
};

function buildAssetTags(paths = [], tagBuilderAction){
  const tags = [];
  paths.forEach(path => {
    tags.push(tagBuilderAction(path));
  });
  return tags;
}

function buildLinkTag(path){
  return `<link href="${buildExternalAssetPath(path)}" rel="stylesheet">`;
}

function buildScriptTag(path){
  return `<script src="${buildExternalAssetPath(path)}"></script>`
}

function buildAngularScriptTag(){
  const cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs/angular.js';
  const version = '1.7.5';
  const file = 'angular.min.js';
  return `<script src="${cdnUrl}/${version}/${file}"></script>`;
}

function buildExternalAssetPath(path){
  return assetsFilepathFilter.isRelativePath(path) ?
    `external/${parseRelativePath(path)}` :
    path;
}

function parseRelativePath(path){
  return path.indexOf('./') === 0 ? path.replace('./','') : path;
}

function buildIndexHtml(linkTags, scriptTags, angularScriptTag){
  const template = getIndexHtmlTemplate();
  let html = injectExternalTagsOnIndex(template, 'external-links', linkTags);
  html = injectExternalTagsOnIndex(html, 'angular', angularScriptTag);
  html = injectExternalTagsOnIndex(html, 'external-scripts', scriptTags);
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
