const _public = {};

_public.getNodeEnv = () => (process.env.NODE_ENV || 'development');

_public.getCwd = () => process.cwd();

module.exports = _public;
