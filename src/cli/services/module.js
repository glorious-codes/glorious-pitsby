const vm = require('vm');

const _public = {};

_public.compileInMemoryModule = string => {
  return vm.runInNewContext(string, { module });
};

module.exports = _public;
