const pkg = require('../../../package.json');
const docService = require('../services/doc');

const _public = {};

_public.exec = () => {
  let doc = docService.read('pitsby');
  doc = doc.replace('{ description }', pkg.description);
  console.log(doc);
};

module.exports = _public;
