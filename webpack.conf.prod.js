const fs = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const project = require('./project.json');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: project.scripts.dist.filename.prod
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          mangle: false
        }
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: project.styles.dist.filename.prod
    })
  ]
}
