const _ = require('lodash'),
  argv = require('yargs').argv,
  baseConfig = require('./webpack.conf.base'),
  devConfig = require('./webpack.conf.dev'),
  prodConfig = require('./webpack.conf.prod'),
  specificConfig = argv.env == 'production' ? prodConfig : devConfig;

module.exports = _.mergeWith(
  baseConfig,
  specificConfig,
  (baseValue, specificValue) => {
    if (_.isArray(baseValue)) return baseValue.concat(specificValue);
  }
);
