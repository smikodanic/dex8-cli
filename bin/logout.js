const fse = require('fs-extra');

module.exports = async () => {
  const filePath = './dex8-auth';

  try {
    await fse.remove(filePath);

    if (fse.pathExists(filePath)) {
      console.log(`Logout was successful and "dex8-auth" was deleted.`);
    }
  } catch (err) {
    throw err;
  }

};
