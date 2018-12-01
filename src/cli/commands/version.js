const pkg = require('../../../package.json');

const _public = {};

_public.exec = () => {
  console.log(`v${pkg.version}`);
};

module.exports = _public;
