const util = require('util');

/**
 * Print the object to the console.
 * @param {object} obj
 */
module.exports = obj => {
  const opts = {
    showHidden: false,
    depth: 5,
    colors: true,
    customInspect: true,
    showProxy: false,
    maxArrayLength: 10,
    maxStringLength: 350,
    breakLength: 80,
    compact: false,
    sorted: false,
    getters: false,
    numericSeparator: false
  };
  console.log(util.inspect(obj, opts));
};
