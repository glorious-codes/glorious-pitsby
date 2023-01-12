const path = require('path');
const cdnService = require('./cdn');
const { fileService } = require('./file');
const processService = require('./process');
const assetsFilepathFilter = require('./assets-filepath-filter');
const externalGlobalDataService = require('./external-global-data');
const webappHtmlIndexCustomisation = require('./webapp-html-index-customisation');

const _public = {};

_public.init = (config = {}) => {
  return new Promise((resolve, reject) => {
    const linkTags = buildAssetTags(config.styles, 'stylesheet');
    const scriptTags = buildAssetTags(config.scripts, 'script');
    const indexHtml = webappHtmlIndexCustomisation.init(buildIndexHtml(
      config,
      linkTags,
      cdnService.buildAngularScriptTag(),
      handleExternalScriptTags(scriptTags, config.projects)
    ), config.custom);
    fileService.write(
      path.join(__dirname, '../../webapp/index.html'),
      clearBlankLines(indexHtml),
      resolve,
      reject
    );
  });
};

function buildAssetTags(items = [], type){
  const tags = [];
  items.forEach(item => {
    tags.push(buildAssetTag(item, type));
  });
  return tags;
}

function buildAssetTag(item, type){
  const attrs = buildAssetTagAttrs(item, type);
  if(shouldUseScriptTag(item, type)) return buildScriptTag(attrs);
  return `<link ${stringifyAssetTagAttrs(attrs)}>`;
}

function shouldUseScriptTag(item, type){
  return type == 'script' && !isPreloadedAsset(item);
}

function buildScriptTag(attrs){
  const { inline, ...rest } = attrs;
  if(inline) return buildInlineScriptTag(rest);
  return buildScriptTagMarkup(rest);
}

function buildInlineScriptTag(attrs){
  const { src, ...rest } = attrs;
  const assetPath = path.join(processService.getCwd(), src);
  const innerHTML = fileService.readSync(assetPath);
  return buildScriptTagMarkup(rest, innerHTML);
}

function buildScriptTagMarkup(attrs, innerHTML = ''){
  return `<script ${stringifyAssetTagAttrs(attrs)}>${innerHTML}</script>`;
}

function buildAssetTagAttrs(item, type){
  const attrs = typeof item == 'string' ? { [buildAssetPathAttrName(item, type)]: item } : item;
  return shouldAppendStylesheetRelAttr(attrs, type) ? { ...attrs, rel: 'stylesheet' } : attrs;
}

function buildAssetPathAttrName(item, type){
  return type == 'script' && !isPreloadedAsset(item) ? 'src' : 'href';
}

function isPreloadedAsset(item){
  return ['preload', 'prefetch'].includes(item.rel);
}

function shouldAppendStylesheetRelAttr(attrs, type){
  return !attrs.rel && type == 'stylesheet';
}

function stringifyAssetTagAttrs(attrs){
  return Object.entries(attrs).map(([key, value]) => {
    return value ? `${key}="${formatExternalAssetAttrValue(key, value)}"` : key;
  }).join(' ');
}

function formatExternalAssetAttrValue(attrName, attrValue){
  return ['href', 'src'].includes(attrName) ? formatExternalAssetPath(attrValue) : attrValue;
}

function handleExternalScriptTags(scriptTags, projects){
  const vueConfig = getProjectEngineConfig(projects, 'vue');
  const reactConfig = getProjectEngineConfig(projects, 'react');
  if(vueConfig) scriptTags.unshift(cdnService.buildVueScriptTag(vueConfig.version));
  if(reactConfig) scriptTags.unshift(cdnService.buildReactScriptTag(reactConfig.version));
  return scriptTags;
}

function getProjectEngineConfig(projects = [], engine){
  return projects.find(project => project.engine == engine);
}

function formatExternalAssetPath(rawPath){
  const path = assetsFilepathFilter.isRelativePath(rawPath) ? `/external/${parseRelativePath(rawPath)}` : rawPath;
  return `${path}?t=${Date.now()}`;
}

function parseRelativePath(path){
  return path.indexOf('./') === 0 ? path.replace('./','') : path;
}

function buildIndexHtml(config, linkTags, angularScriptTag, externalScriptTags){
  const template = getIndexHtmlTemplate(config);
  let html = injectExternalTagsOnIndex(template, 'external-links', linkTags);
  html = injectExternalTagsOnIndex(html, 'angular', angularScriptTag);
  html = injectExternalTagsOnIndex(html, 'external-scripts', externalScriptTags);
  return clearBlankLines(html);
}

function injectExternalTagsOnIndex(indexHtml, tagType, tags){
  const html = Array.isArray(tags) ? tags.join('\n') : tags;
  return indexHtml.replace(`<!-- inject:${tagType} -->`, html);
}

function getIndexHtmlTemplate(config){
  const template = fileService.readSync(
    path.join(__dirname, '../../webapp/index-template.html')
  );
  const data = externalGlobalDataService.build(config);
  return template.replace(
    '<!-- inject:external-global-data -->',
    `<script type="text/javascript">window.pitsbyGlobals=${JSON.stringify(data)}</script>`
  );
}

function clearBlankLines(markup){
  return markup.replace(/^[\s]+$/gm, '').replace(/[\n]+$/gm, '');
}

module.exports = _public;
