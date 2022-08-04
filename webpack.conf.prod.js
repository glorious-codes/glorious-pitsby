const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const project = require('./project.json');

module.exports = {
  mode: 'production',
  output: {
    filename: project.scripts.webapp.dist.filename.prod
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          compress: {
            warnings: false,
          }
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: project.styles.dist.filename.prod
    })
  ]
}
