const fse = require('fs-extra');
const chalk = require('chalk');



module.exports = async () => {
  const filePath = './dex8auth.json';

  try {

    await fse.remove(filePath);
    if (!fse.pathExistsSync(filePath)) {
      console.log(`Logout was successful and "dex8auth.json" was deleted.`);
    }

  } catch (err) {
    console.log(chalk.red(err.message));
  }

  process.exit();

};
