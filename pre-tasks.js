const path = require('path');
const rimraf = require('rimraf');
const webappHtmlIndexGenerator = require('./src/cli/services/webapp-html-index-generator');
const webappIndexGenerator = require('./src/cli/services/webapp-index-generator');

const _public = {};

_public.removeAssets = () => {
  const basepath = './src/webapp';
  const assets = ['index.html', 'scripts/index.js'];
  assets.forEach(path => rimraf.sync(`${basepath}/${path}`, { disableGlob: true }));
}

_public.generatePlaceholderFiles = () => {
  webappHtmlIndexGenerator.init();
  webappIndexGenerator.init();
}

module.exports = _public;
