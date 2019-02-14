const _public = {};

_public.setNodeEnv = env => {
  process.env.NODE_ENV = env;
};

module.exports = _public;
