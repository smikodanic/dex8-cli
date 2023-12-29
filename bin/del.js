const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');



module.exports = async (skriptTitle) => {

  const questions = [
    { type: 'confirm', name: 'tf', message: `Do you want to delete skript "${skriptTitle}" ?`, default: false }
  ];

  try {
    const answers = await inquirer.prompt(questions); // true/false

    // define directory to be removed
    let dir = path.join(process.cwd(), skriptTitle); // if current working directory (cwd) is above skript folder
    const tf1 = await fse.pathExists(dir);
    if (!tf1) { dir = path.join(process.cwd(), `../${skriptTitle}`); } // if current working directory (cwd) is in the skript folder


    if (answers.tf) {
      await fse.remove(dir); // delete skriptTitle recursively
      console.log(`Skript "${skriptTitle}" is deleted and folder ${dir} is removed.`);
    } else {
      console.log(`Skript "${skriptTitle} is not deleted and folder ${dir} is not removed.`);
    }

  } catch (err) {
    console.log(chalk.red(err.message));
  }

  process.exit();

};
