const _ = require('lodash');
const baseConfig = require('./webpack.conf.base');
const devConfig = require('./webpack.conf.dev');
const prodConfig = require('./webpack.conf.prod');
const specificConfig = process.env.NODE_ENV == 'production' ? prodConfig : devConfig;

module.exports = _.mergeWith(
  baseConfig,
  specificConfig,
  (baseValue, specificValue) => {
    if (_.isArray(baseValue)) return baseValue.concat(specificValue);
  }
);
