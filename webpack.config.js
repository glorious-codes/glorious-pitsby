const _ = require('lodash'),
  baseConfig = require('./webpack.conf.base'),
  devConfig = require('./webpack.conf.dev'),
  prodConfig = require('./webpack.conf.prod'),
  specificConfig = process.env.NODE_ENV == 'production' ? prodConfig : devConfig;

module.exports = _.mergeWith(
  baseConfig,
  specificConfig,
  (baseValue, specificValue) => {
    if (_.isArray(baseValue)) return baseValue.concat(specificValue);
  }
);
