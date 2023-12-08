const webpack = require('webpack');
const config = require('./webpack.config.js');


module.exports = async () => {

  try {
    console.log('Bundling main.js in pogress. Please wait...');

    webpack(config, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (stats.hasErrors()) {
        console.error('Build failed with errors.');
        console.error(stats.toString({
          chunks: false,
          colors: true,
          modules: false,
          reasons: false
        }));
        return;
      }

      // Log result...
      console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Adds colors to the output
      }));

      console.log('Bundling is finished');
    });


  } catch (err) {
    throw err;
  }

};
