const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');


module.exports = async (taskName) => {

  const questions = [
    { type: 'confirm', name: 'tf', message: 'Are you sure to delete the Mikros Task?', default: false }
  ];

  try {
    const answers = await inquirer.prompt(questions); // true/false

    // define directory to be removed
    let dir = path.join(process.cwd(), taskName); // if current working directory (cwd) is above task folder
    const tf1 = await fse.pathExists(dir);
    if (!tf1) { dir = path.join(process.cwd(), `../${taskName}`); } // if current working directory (cwd) is in the task folder


    if (answers.tf) {
      await fse.remove(dir); // delete taskName recursively
      console.log(`Task "${taskName}" is deleted in dir ${dir}.`);
    } else {
      console.log(`Task "${taskName} is not deleted in dir ${dir}.`);
      process.exit();
    }

  } catch (err) {
    throw err;
  }

};
