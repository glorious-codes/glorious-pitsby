const path = require('path');
const pkg = require('../../../package.json');
const argsService = require('./args');
const { fileService } = require('./file');
const assetsFilepathFilter = require('./assets-filepath-filter');

const _public = {};

_public.init = (options = {}, projects = []) => {
  const linkTags = buildAssetTags(options.styles, buildLinkTag);
  const scriptTags = buildAssetTags(options.scripts, buildScriptTag);
  const indexHtml = buildIndexHtml(
    linkTags,
    handleVueScriptsTag(scriptTags, projects),
    buildComponentEngineScriptTag('angular.js', pkg.devDependencies.angular.replace('^', ''))
  );
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
  return `<link href="${buildExternalAssetPath(path)}?t=${Date.now()}" rel="stylesheet">`;
}

function buildScriptTag(path){
  return `<script src="${buildExternalAssetPath(path)}?t=${Date.now()}"></script>`;
}

function handleVueScriptsTag(scriptTags, projects){
  const vueProject = getVueProject(projects);
  return vueProject ? prependVueScriptTag(scriptTags, vueProject) : scriptTags;
}

function getVueProject(projects){
  for (var i = 0; i < projects.length; i++)
    if(projects[i].engine == 'vue')
      return projects[i];
}

function prependVueScriptTag(scriptTags, vueProject){
  scriptTags.unshift(buildComponentEngineScriptTag('vue', (vueProject.version || '2.5.13')));
  return scriptTags;
}

function buildComponentEngineScriptTag(engine, version){
  const cdnUrl = `https://cdnjs.cloudflare.com/ajax/libs/${engine}`;
  const file = buildComponentEngineFileName(engine);
  return `<script src="${cdnUrl}/${version}/${file}"></script>`;
}

function buildComponentEngineFileName(engine){
  const suffix = argsService.getCliArgs('--env') == 'production' ? '.min.js' : '.js';
  return `${engine.replace('.js', '')}${suffix}`;
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
