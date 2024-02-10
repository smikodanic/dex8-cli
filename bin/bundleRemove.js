const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');



module.exports = async () => {
  try {
    const distDir = path.join(process.cwd(), 'dist');
    await fse.remove(distDir);
    console.log(`The bundle /dist/ directory is removed.`);
  } catch (err) {
    console.log(chalk.red(err.message));
  }

  process.exit();
};
