const fse = require('fs-extra');

module.exports = async () => {
  const filePath = './conf.js';

  try {
    await fse.remove(filePath);

    if (fse.pathExists(filePath)) {
      console.log(`Logout was successful and "conf.js" was deleted.`);
    }
  } catch (err) {
    throw err;
  }

};
