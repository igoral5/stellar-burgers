const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: path.join(__dirname, '..', './dist'),
    compress: true,
    historyApiFallback: true,
    port: 4000,
    open: true
  }
};
