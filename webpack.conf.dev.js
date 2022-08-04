const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('./project.json');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: project.scripts.webapp.dist.filename.dev
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: project.styles.dist.filename.dev
    })
  ]
}
