const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('./project.json');

module.exports = {
  entry: [`${__dirname}/${project.scripts.webapp.source.index}`],
  externals: {
    'angular': 'angular',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'vue': 'Vue'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|external)/,
        use: 'babel-loader'
      },
      {
        test: /\.html$/,
        include: [`${__dirname}/${project.scripts.webapp.source.root}`],
        use: 'html-loader'
      },
      {
        test: /\.(styl|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@cli': `${__dirname}/${project.scripts.cli.source.root}`,
      '@data': `${__dirname}/${project.data.source.root}`,
      '@scripts': `${__dirname}/${project.scripts.webapp.source.root}`,
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: project.images.source.files,
          to: project.images.dist.root
        },
        {
          from: project.data.source.files,
          to: project.data.dist.root
        },
        {
          from: project.external.source.root,
          to: project.external.dist.root
        }
      ]
    })
  ],
  context: path.resolve(__dirname),
  stats: 'none'
}
