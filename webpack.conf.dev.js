const fs = require('fs'),
  webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  DashboardPlugin = require('webpack-dashboard/plugin'),
  project = require('./project.json');

module.exports = {
  devtool: 'eval',
  output: {
    filename: project.scripts.dist.filename.dev
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin(project.styles.dist.filename.dev),
    new DashboardPlugin()
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    contentBase: `${__dirname}/${project.index.dist.root}`,
    port: 7000
  }
}
