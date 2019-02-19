const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('./project.json');

module.exports = {
  entry: `${__dirname}/${project.scripts.source.index}`,
  externals: {
    angular: 'angular',
    vue: 'Vue'
  },
  module: {
    rules: [{
      test: /\.(styl|css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { minimize: true } },
        'stylus-loader'
      ]
    }, {
      test: /\.html$/,
      include: [`${__dirname}/${project.scripts.source.root}`],
      use: 'html-loader'
    }, {
      test: /\.js$/,
      exclude: /(node_modules|external)/,
      use: 'babel-loader'
    }]
  },
  resolve: {
    alias: {
      '@scripts': `${__dirname}/${project.scripts.source.root}`,
      '@styles': `${__dirname}/${project.styles.source.root}`
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: project.index.source.file,
      minify: {
        collapseWhitespace: true
      }
    }),
    new CopyWebpackPlugin([{
      from: project.images.source.files,
      to: project.images.dist.root
    }, {
      from: project.data.source.files,
      to: project.data.dist.root
    },
    {
      from: project.external.source.root,
      to: project.external.dist.root
    }])
  ],
  context: path.resolve(__dirname)
}
