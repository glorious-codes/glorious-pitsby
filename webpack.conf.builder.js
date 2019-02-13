const _ = require('lodash'),
  baseConfig = require('./webpack.conf.base'),
  devConfig = require('./webpack.conf.dev'),
  prodConfig = require('./webpack.conf.prod'),
  _public = {};

_public.build = env => {
  const specificConfig = env == 'production' ? prodConfig : devConfig;
  return _.mergeWith(
    baseConfig.build(env),
    specificConfig,
    (baseValue, specificValue) => {
      if (_.isArray(baseValue)) return baseValue.concat(specificValue);
    }
  );
}

module.exports = _public;
