const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');


module.exports = async () => {
  try {
    const questions = [
      { type: 'input', name: 'taskTitle', message: 'Task title:', required: true },
      { type: 'input', name: 'taskDescription', message: 'Task description:' },
      { type: 'input', name: 'taskCategory', message: 'Task category:', default: 'general' },
      { type: 'input', name: 'taskThumbnail', message: 'Task thumbnail URL:' },
      { type: 'confirm', name: 'taskWaitForOutput', message: 'Should client wait for output:', default: false },
      { type: 'list', name: 'template', message: 'Select task template:', choices: ['basic', 'puppeteer'], default: false }
    ];

    const answers = await inquirer.prompt(questions);

    const taskTitle = answers.taskTitle.toLowerCase().trim().replace(/\s+/g, '-');
    const taskDescription = answers.taskDescription.replace(/\s+/g, ' ').trim();
    const taskCategory = answers.taskCategory.replace(/\s+/g, ' ').trim();
    const taskThumbnail = answers.taskThumbnail.replace(/\s+/g, '').trim();
    const taskWaitForOutput = answers.taskWaitForOutput;

    if (!taskTitle) { throw new Error('The Task title is required.'); }

    // copy task_template folder taskTitle folder
    await fse.ensureDir(taskTitle);
    const sourceDir = path.join(__dirname, 'task_templates', answers.template);
    const destDir = path.join(process.cwd(), taskTitle);
    await fse.copy(sourceDir, destDir);
    console.log(`Files copied from ${sourceDir} to ${destDir}`);

    // remove node_modules and package-lock.json
    await fse.remove(path.join(destDir, 'node_modules'));
    await fse.remove(path.join(destDir, 'package-lock.json'));

    // rename gitignore (npm does not publish task_template/.gitignore so task_template/gitignore is used)
    const gitignore_old = path.join(destDir, 'gitignore');
    const gitignore_new = path.join(destDir, '.gitignore');
    await fse.rename(gitignore_old, gitignore_new);

    // set package.json name and description
    const packageJson_path = path.join(destDir, 'package.json');
    const package_obj = require(packageJson_path);
    package_obj.name = taskTitle;
    package_obj.description = taskDescription;
    await fse.writeFile(packageJson_path, JSON.stringify(package_obj, null, 2), { encoding: 'utf8' });

    // set manifest.json name and description
    const manifestJson_path = path.join(destDir, 'manifest.json');
    const manifest_obj = require(manifestJson_path);
    manifest_obj.title = taskTitle;
    manifest_obj.description = taskDescription;
    manifest_obj.category = taskCategory;
    manifest_obj.thumbnail = taskThumbnail;
    manifest_obj.waitForOutput = taskWaitForOutput;
    await fse.writeFile(manifestJson_path, JSON.stringify(manifest_obj, null, 2), { encoding: 'utf8' });

    // howto.html
    const howto_path = path.join(destDir, 'howto.html');
    await fse.writeFile(howto_path, `<h1>${taskTitle}</h1>\n<p>${taskDescription}</p>`, { encoding: 'utf8' });

    // README.md
    const readme_path = path.join(destDir, 'README.md');
    await fse.writeFile(readme_path, `# ${taskTitle}\n> ${taskDescription}`, { encoding: 'utf8' });


    console.log(`Task "${taskTitle}" initialized and folder is created.`);


  } catch (err) {
    console.log(chalk.red(err.message));
  }

};
