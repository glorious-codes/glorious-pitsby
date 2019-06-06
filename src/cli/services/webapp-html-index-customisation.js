const path = require('path');

const _public = {};

_public.init = (template, customConfig = {}) => {
  const html = handleFavicon(customConfig.favicon, template);
  return handleWindowTitle(customConfig.windowTitle, html);
};

function handleFavicon({ filepath } = {}, template){
  return template.replace('{{ faviconHref }}', buildFaviconHref(filepath));
}

function buildFaviconHref(filepath){
  const href = filepath ? path.join('external', filepath) : 'images/favicon-pitsby.png';
  return `${href}?t=${Date.now()}`;
}

function handleWindowTitle(title = 'Pitsby', template){
  return template.replace('{{ title }}', title);
}

module.exports = _public;
