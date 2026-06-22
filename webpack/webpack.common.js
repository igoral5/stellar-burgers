const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugins = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          production ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.module\.css$/i,
        exclude: /node_modules/,
        use: [
          production ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    new HTMLWebpackPlugins({
      template: path.resolve(__dirname, '..', 'public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/styles/[name].[contenthash].css'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development' // значение по умолчанию 'development', если переменная process.env.NODE_ENV не передана при вызове сборки
    }),
    new Dotenv({
      systemvars: true
    })
  ],
  resolve: {
    extensions: [
      '*',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.css',
      '.scss',
      '.png',
      '.svg',
      '.jpg'
    ],
    alias: {
      '@pages': path.resolve(__dirname, '..', './src/pages'),
      '@components': path.resolve(__dirname, '..', './src/components'),
      '@ui': path.resolve(__dirname, '..', './src/components/ui'),
      '@ui-pages': path.resolve(__dirname, '..', './src/components/ui/pages'),
      '@utils-types': path.resolve(__dirname, '..', './src/utils/types'),
      '@utils-data': path.resolve(__dirname, '..', './src/utils/data.ts'),
      '@api': path.resolve(__dirname, '..', './src/utils/burger-api.ts'),
      '@slices': path.resolve(__dirname, '..', './src/services/slices'),
      '@selectors': path.resolve(__dirname, '..', './src/services/selectors'),
      '@services': path.resolve(__dirname, '..', './src/services/store.ts'),
      '@cookie': path.resolve(__dirname, '..', './src/utils/cookie.ts')
    }
  },
  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: production ? '[name].[contenthash].js' : 'bundle.js',
    clean: true
  }
};
