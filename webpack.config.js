const _ = require('lodash'),
  argv = require('yargs').argv,
  baseConfig = require('./webpack.conf.base'),
  devConfig = require('./webpack.conf.dev'),
  prodConfig = require('./webpack.conf.prod'),
  env = process.env.NODE_ENV || argv.env || 'development';
  specificConfig = env == 'production' ? prodConfig : devConfig;

module.exports = _.mergeWith(
  baseConfig,
  specificConfig,
  (baseValue, specificValue) => {
    if (_.isArray(baseValue)) return baseValue.concat(specificValue);
  }
);
