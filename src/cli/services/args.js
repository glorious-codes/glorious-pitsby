const _public = {};

_public.getCliArgs = () => {
  return process.argv.slice(2);
};

module.exports = _public;
