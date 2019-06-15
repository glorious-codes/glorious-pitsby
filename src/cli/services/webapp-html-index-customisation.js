const path = require('path');

const _public = {};

_public.init = (template, customConfig = {}) => {
  let html = handleFavicon(customConfig.favicon, template);
  html = handleWindowTitle(customConfig.windowTitle, html);
  return handleStyles(customConfig.styles, html);
};

function handleFavicon({ filepath } = {}, template){
  return template.replace('{{ faviconHref }}', buildFaviconHref(filepath));
}

function buildFaviconHref(filepath){
  const href = filepath ? buildCustomFaviconHref(filepath) : 'images/favicon-pitsby.png';
  return `${href}?t=${Date.now()}`;
}

function buildCustomFaviconHref(filepath){
  return filepath.includes('http') ? filepath :path.join('external', filepath);
}

function handleWindowTitle(title = 'Pitsby', template){
  return template.replace('{{ title }}', title);
}

function handleStyles(styles, template){
  const styleTag = styles ? `<style data-custom-styles>${removeUnwantedChars(styles)}</style>` : '';
  return template.replace('<!-- inject:custom-styles -->', styleTag);
}

function removeUnwantedChars(styles){
  return removeLineBreaks(removeUnnecessarySpaces(styles));
}

function removeLineBreaks(text){
  return text.replace(/[\n\t]/g, '');
}

function removeUnnecessarySpaces(text){
  return text.replace(/[ ]{2,}/g, ' ').trim();
}

module.exports = _public;
