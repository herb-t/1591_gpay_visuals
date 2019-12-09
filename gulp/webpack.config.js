/** @fileoverview  webpack config file for web-standard scaffold.
 */
const WrapperPlugin = require('webpack-wrapper-plugin');
const path = require('path');
// Webpack config for non-Closure projects in dev mode
module.exports = {
  devtool: 'inline-source-map',
  entry: {
    index: './src/index',
    detect: './src/detect/detect',
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, './src/static/js/'),
  },
  // 'module' variable defined in angular directive files gets overwritten
  // after transpiling, the wrapper plugin adds additional wrapper to
  // create local scope.
  plugins: [new WrapperPlugin({})],
};
