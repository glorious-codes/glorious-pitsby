const _public = {};

_public.getNodeEnv = () => {
  return process.env.NODE_ENV || 'development';
};

module.exports = _public;
