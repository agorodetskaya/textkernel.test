/* eslint-disable sort-keys, no-undef, max-len */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.join(__dirname, '/build'),
    publicPath: '',
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new CopyPlugin([
      {
        from: 'public',
        test: /^((?!\.html).*)$/,
      },
    ]),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
      },
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        exclude: /node_modules/,
        test: /\.svg$/,
        use: [
          {
            loader: 'react-svg-loader',
          },
        ],
      },
    ],
  },
};
