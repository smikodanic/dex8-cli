const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');


module.exports = async (taskTitle) => {

  const questions = [
    { type: 'list', name: 'template', message: 'Please select a DEX8 Task template', choices: ['basic', 'puppeteer'], default: false }
  ];

  try {
    const answers = await inquirer.prompt(questions);

    // copy task_template folder taskTitle folder
    await fse.ensureDir(taskTitle);
    const sourceDir = path.join(__dirname, 'task_templates', answers.template);
    const destDir = path.join(process.cwd(), taskTitle);
    await fse.copy(sourceDir, destDir);
    console.log(`Copied from ${sourceDir} to ${destDir}`);

    // rename gitignore (npm does not publish task_template/.gitignore so task_template/gitignore is used)
    const gitignore_old = path.join(destDir, 'gitignore');
    const gitignore_new = path.join(destDir, '.gitignore');
    await fse.rename(gitignore_old, gitignore_new);

    const tf = await fse.pathExists(destDir);
    if (tf) { console.log(`Task "${taskTitle}" initialized and folder is created.`); }

  } catch (err) {
    throw err;
  }

};
