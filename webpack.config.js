const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
    publicPath: '/',
    clean: true,
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'components': path.resolve(__dirname, 'src/components'),
      'contexts': path.resolve(__dirname, 'src/contexts'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'lib': path.resolve(__dirname, 'src/lib'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'services': path.resolve(__dirname, 'src/services'),
      'styles': path.resolve(__dirname, 'src/styles'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'twin.macro': path.resolve(__dirname, 'node_modules/twin.macro'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              '@babel/preset-react'
            ],
            plugins: [
              'babel-plugin-macros',
              '@emotion/babel-plugin',
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          filename: 'images/[hash][ext][query]'
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: 'single',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      inject: true,
      ...(isProduction && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ].filter(Boolean),
  experiments: {
    topLevelAwait: true,
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};