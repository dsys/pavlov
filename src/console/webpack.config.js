import BabelMinifyWebpackPlugin from 'babel-minify-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const BANNER = fs
  .readFileSync(path.resolve(__dirname, 'browser/banner.txt'))
  .toString();

const ENTRY_PATH = path.resolve(__dirname, 'browser/index.js');
const INDEX_PATH = path.resolve(__dirname, 'static/index.html');

const extractSass = new ExtractTextPlugin({
  filename: 'assets/bundle.[contenthash].css',
  allChunks: true,
  disable: __DEV__
});

const config = {
  target: 'web',
  devtool: __DEV__ ? 'eval-source-map' : false,
  entry: ['babel-polyfill', 'react-hot-loader/patch', ENTRY_PATH],
  output: {
    filename: __DEV__ ? 'assets/bundle.js' : 'assets/bundle.[hash].js',
    path: '/',
    publicPath: '/'
  },
  resolve: { extensions: ['.js', '.jsx', '.json'] },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.jsx?.flow?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.html/,
        loader: 'html-loader',
        options: { minimize: !__DEV__ }
      },
      {
        test: /\.(png|jpe?g|gif|ttf|woff|eot)$/,
        loader: 'file-loader?name=assets/[hash].[ext]'
      },
      {
        test: /\.(s(c|a)ss|css)$/,
        loader: extractSass.extract({
          use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    extractSass,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(__ENV__)
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HTMLWebpackPlugin({ template: INDEX_PATH })
  ]
};

if (__DEV__) {
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  config.entry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr');
} else {
  config.plugins.push(
    new webpack.BannerPlugin({
      banner: BANNER
    })
  );
  config.plugins.push(new BabelMinifyWebpackPlugin());
}

export default config;
