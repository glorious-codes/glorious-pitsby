const webpack = require('webpack');

const _public = {};

_public.compile = (config, onComplete) => {
  webpack(config, onComplete);
};

module.exports = _public;
