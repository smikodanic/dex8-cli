/**
 * Download Dex8 skript.
 * $ dex8 download <skript_id>
 */
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const { HttpClient } = require('@mikosoft/httpclient-node');
const config = require('../config.js');
const jsonFixer = require('./helper_jsonFixer.js');



module.exports = async (skript_id) => {
  const skriptFolder = process.cwd();

  try {

    /*** 0) remove all files except dex8auth.json ***/
    const oldFiles = await fse.readdir(skriptFolder);
    for (const oldFile of oldFiles) {
      const stat = await fse.lstat(oldFile);
      if (stat.isFile() && oldFile !== 'dex8auth.json') {
        await fse.remove(path.join(skriptFolder, oldFile));
        console.log(`Deleted ${oldFile}`);
      }
    }


    /*** 1) get dex8auth.json  (which is created after successful login) ***/
    const authPath = path.join(skriptFolder, 'dex8auth.json');
    const tf = await fse.pathExists(authPath);
    if (!tf) { throw new Error(`File "dex8auth.json" is not created. Please login.`); }
    const conf = require(authPath);

    /*** 2) send API request to /cli/download/:skript_id ***/
    // init httpClient
    const opts = {
      encodeURI: false,
      encoding: 'utf8',
      timeout: 90000,
      retry: 1,
      retryDelay: 2100,
      maxRedirects: 0,
      headers: {
        'authorization': conf.jwtToken,
        'user-agent': 'DEX8-CLI',
        'accept': 'application/json', // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        'cache-control': 'no-cache',
        'host': '',
        'accept-encoding': 'gzip',
        'connection': 'close', // keep-alive
        'content-type': 'application/json; charset=UTF-8'
      },
      debug: false
    };
    const dhc = new HttpClient(opts);

    // send POST /cli/login request
    const url = `${config.mainapiBaseURL}/cli/download/${skript_id}`;
    const answer = await dhc.askJSON(url, 'GET', {});
    // console.log(answer);

    const skript = answer.res.content.skript;
    const skriptFiles = answer.res.content.skriptFiles;
    const inputs = answer.res.content.inputs;
    const inputSecrets = answer.res.content.inputSecrets;
    if (!skript) { throw new Error(`Skript _id:${skript_id} does not exists.`); }

    console.log(`\nDownloading skript "${skript.title}" into "${skriptFolder}"...\n`);


    // check if skript.title is same as current folder
    const fracts = skriptFolder.split('/');
    if (fracts[fracts.length - 1] !== skript.title) { throw new Error(`Folder name should be same as skript title. Please rename your folder to "${skript.title}".`); }



    /*** 3.A) create .js files ***/
    skriptFiles.forEach(async f => {
      console.log('Create file:', f.name);
      const filePath = path.join(skriptFolder, f.name);
      await fse.ensureFile(filePath).then(() => fse.writeFile(filePath, f.content, { encoding: 'utf8', flag: 'w' }));
    });


    await new Promise(resolve => setTimeout(resolve, 400)); // delay

    /*** 3.B) create input*.js files ***/
    inputs.forEach(async f => {
      console.log('Create input file:', f.name);
      const filePath = path.join(skriptFolder, f.name);
      const val = jsonFixer.dollarUnmodify(f.val);
      const content = JSON.stringify(val, null, 4);
      await fse.ensureFile(filePath).then(() => fse.writeFile(filePath, content, { encoding: 'utf8', flag: 'w' }));
    });

    await new Promise(resolve => setTimeout(resolve, 400)); // delay

    /*** 3.C) create inputSecret*.js files ***/
    console.log(chalk.yellow('File inputSecret*.json is not downloaded. Create it manually.'));


    /*** 4) create manifest.json ***/
    console.log('Creating manifest.json');
    const manifest = {
      title: skript.title,
      description: skript.description,
      thumbnail: skript.thumbnail,
      category: skript.category,
      environment: skript.environment,
      worker_response_timeout: skript.worker_response_timeout
    };
    const filePath1 = path.join(skriptFolder, 'manifest.json');
    fse.ensureFile(filePath1).then(() => fse.writeJson(filePath1, manifest, { spaces: 2 }));


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 5) create hidden file .editorconfig ***/
    console.log('Creating .editorconfig');
    const editorconfigContent = await fse.readFile(path.join(__dirname, 'skript_templates/basic/.editorconfig'));
    const filePath3 = path.join(skriptFolder, '.editorconfig');
    fse.ensureFile(filePath3).then(() => fse.writeFile(filePath3, editorconfigContent, { encoding: 'utf8', flag: 'w' }));


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 7) create hidden file .eslintrc ***/
    console.log('Creating .eslintrc');
    const eslintrcContent = await fse.readFile(path.join(__dirname, 'skript_templates/basic/.eslintrc'));
    const filePath4 = path.join(skriptFolder, '.eslintrc');
    fse.ensureFile(filePath4).then(() => fse.writeFile(filePath4, eslintrcContent, { encoding: 'utf8', flag: 'w' }));


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 7) create hidden file .gitignore ***/
    console.log('Creating .gitignore');
    const gitignoreContent = await fse.readFile(path.join(__dirname, 'skript_templates/basic/gitignore'));
    const filePath5 = path.join(skriptFolder, '.gitignore');
    fse.ensureFile(filePath5).then(() => fse.writeFile(filePath5, gitignoreContent, { encoding: 'utf8', flag: 'w' }));

    console.log('\nThe skript is downloaded');

  } catch (err) {
    console.log(chalk.red(err.message));
  }


  process.exit();
};


