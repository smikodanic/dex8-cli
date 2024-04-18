const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');



module.exports = async () => {
  try {
    const questions = [
      { type: 'input', name: 'skriptTitle', message: 'Skript title:', required: true },
      { type: 'input', name: 'skriptDescription', message: 'Skript description:' },
      { type: 'input', name: 'skriptCategory', message: 'Skript category:', default: 'general' },
      { type: 'input', name: 'skriptThumbnail', message: 'Skript thumbnail URL:' },
      { type: 'list', name: 'skriptEnvironment', message: 'Select skript environment:', choices: ['nodejs', 'browser', 'python'], default: 'nodejs' },
      { type: 'list', name: 'template', message: 'Select skript template:', choices: ['basic', 'puppeteer', 'httpclient-pptr', 'facebook-login'], default: false }
    ];

    const answers = await inquirer.prompt(questions);

    const skriptTitle = answers.skriptTitle.toLowerCase().trim().replace(/\s+/g, '-');
    const skriptDescription = answers.skriptDescription.replace(/\s+/g, ' ').trim();
    const skriptCategory = answers.skriptCategory.replace(/\s+/g, ' ').trim();
    const skriptThumbnail = answers.skriptThumbnail.replace(/\s+/g, '').trim();
    const skriptEnvironment = answers.skriptEnvironment;

    if (!skriptTitle) { throw new Error('The Skript title is required.'); }

    // copy skript_template folder skriptTitle folder
    await fse.ensureDir(skriptTitle);
    const sourceDir = path.join(__dirname, 'skript_templates', answers.template);
    const destDir = path.join(process.cwd(), skriptTitle);
    await fse.copy(sourceDir, destDir);
    console.log(`Files copied from ${sourceDir} to ${destDir}`);

    // remove node_modules and package-lock.json
    await fse.remove(path.join(destDir, 'node_modules'));
    await fse.remove(path.join(destDir, 'package-lock.json'));

    // rename gitignore (npm does not publish skript_template/.gitignore so skript_template/gitignore is used)
    const gitignore_old = path.join(destDir, 'gitignore');
    const gitignore_new = path.join(destDir, '.gitignore');
    await fse.rename(gitignore_old, gitignore_new);

    // package.json
    const packageJson_path = path.join(destDir, 'package.json');
    const package_obj = require(packageJson_path);
    package_obj.name = skriptTitle;
    package_obj.description = skriptDescription;
    await fse.writeFile(packageJson_path, JSON.stringify(package_obj, null, 2), { encoding: 'utf8' });

    // manifest.json
    const manifestJson_path = path.join(destDir, 'manifest.json');
    const manifest_obj = require(manifestJson_path);
    manifest_obj.title = skriptTitle;
    manifest_obj.description = skriptDescription;
    manifest_obj.category = skriptCategory;
    manifest_obj.thumbnail = skriptThumbnail;
    manifest_obj.environment = skriptEnvironment;
    await fse.writeFile(manifestJson_path, JSON.stringify(manifest_obj, null, 2), { encoding: 'utf8' });

    // howto.html
    const howto_path = path.join(destDir, 'howto.html');
    await fse.writeFile(howto_path, `<h1>${skriptTitle}</h1>\n<p>${skriptDescription}</p>`, { encoding: 'utf8' });

    // README.md
    const readme_path = path.join(destDir, 'README.md');
    await fse.writeFile(readme_path, `# ${skriptTitle}\n> ${skriptDescription}`, { encoding: 'utf8' });


    console.log(`Skript "${skriptTitle}" initialized and folder is created.`);


  } catch (err) {
    console.log(chalk.red(err.message));
  }

  process.exit();

};
