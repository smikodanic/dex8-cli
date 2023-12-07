const path = require('path');

module.exports = {
  mode: 'production',// 'development' or 'production'
  entry: './main.js', // entry file
  devtool: 'source-map', // enable sourcemaps for debugging
  target: 'node',

  output: {
    path: path.resolve(process.cwd(), 'dist'),
    libraryTarget: 'commonjs2', // enables the use of CommonJS modules i.e. require('./dist/mainBundle.js)
    filename: 'mainBundle.js',
    globalObject: 'this', // Depending on the environment you may need this
  }
};
