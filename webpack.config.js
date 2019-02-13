const argv = require('yargs').argv;
const webpackConfigBuilder = require('./webpack.conf.builder.js');

module.exports = webpackConfigBuilder.build(argv.env);
