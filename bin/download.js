/**
 * Download Dex8 task.
 * $ dex8 download <task_id>
 */
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const { HttpClient } = require('@mikosoft/httpclient-node');
const config = require('../config.js');



module.exports = async (task_id) => {
  const taskFolder = process.cwd();

  try {

    /*** 0) remove all files except dex8-auth.json ***/
    const oldFiles = await fse.readdir(taskFolder);
    for (const oldFile of oldFiles) {
      const stat = await fse.lstat(oldFile);
      if (stat.isFile() && oldFile !== 'dex8-auth.json') {
        await fse.remove(path.join(taskFolder, oldFile));
        console.log(`Deleted ${oldFile}`);
      }
    }


    /*** 1) get dex8-auth.json  (which is created after successful login) ***/
    const authPath = path.join(taskFolder, 'dex8-auth.json');
    const tf = await fse.pathExists(authPath);
    if (!tf) { throw new Error(`File "dex8-auth.json" is not created. Please login.`); }
    const conf = require(authPath);

    /*** 2) send API request to /cli/download/:task_id ***/
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
    const url = `${config.mainapiBaseURL}/cli/download/${task_id}`;
    const answer = await dhc.askJSON(url, 'GET', {});
    // console.log(answer);

    const task = answer.res.content.task;
    const files = answer.res.content.files;
    if (!task) { throw new Error(`Task ${task_id} does not exists.`); }

    console.log(`\nDownloading task "${task.title}" into "${taskFolder}"...\n`);


    // check if task.title is same as current folder
    const fracts = taskFolder.split('/');
    if (fracts[fracts.length - 1] !== task.title) { throw new Error(`Folder name should be same as task title. Please rename your folder to "${task.title}".`); }



    /*** 3) create .js files ***/
    files.forEach(f => {
      console.log('Creating ', f.name);
      const filePath = path.join(taskFolder, f.name);
      fse.ensureFile(filePath).then(() => fse.writeFile(filePath, f.content, { encoding: 'utf8', flag: 'w' }));
    });


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 4) create manifest.json ***/
    console.log('Creating manifest.json');
    const files2 = files.map(f => {
      // const f_cloned = Object.assign({}, f); // clone file object because we don't want to modify files array
      const f_cloned = { ...f }; // clone file object because we don't want to modify files array
      delete f_cloned.content;
      delete f_cloned.user_id;
      delete f_cloned.task_id;
      delete f_cloned.created_at;
      delete f_cloned.updated_at;
      delete f_cloned.__v;
      delete f_cloned._id;
      return f_cloned;
    });
    const manifest = {
      title: task.title,
      description: task.description,
      thumbnail: task.thumbnail,
      category: task.category,
      files: files2,
      howto: ''
    };
    const filePath1 = path.join(taskFolder, 'manifest.json');
    fse.ensureFile(filePath1).then(() => fse.writeJson(filePath1, manifest, { spaces: 2 }));


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 5) create howto.html ***/
    console.log('Creating howto.html');
    const filePath2 = path.join(taskFolder, 'howto.html');
    fse.ensureFile(filePath2).then(() => fse.writeFile(filePath2, task.howto, { encoding: 'utf8', flag: 'w' }));


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 6) create hidden file .editorconfig ***/
    console.log('Creating .editorconfig');
    const editorconfigContent = await fse.readFile(path.join(__dirname, 'task_templates/basic/.editorconfig'));
    const filePath3 = path.join(taskFolder, '.editorconfig');
    fse.ensureFile(filePath3).then(() => fse.writeFile(filePath3, editorconfigContent, { encoding: 'utf8', flag: 'w' }));


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 7) create hidden file .eslintrc ***/
    console.log('Creating .eslintrc');
    const eslintrcContent = await fse.readFile(path.join(__dirname, 'task_templates/basic/.eslintrc'));
    const filePath4 = path.join(taskFolder, '.eslintrc');
    fse.ensureFile(filePath4).then(() => fse.writeFile(filePath4, eslintrcContent, { encoding: 'utf8', flag: 'w' }));


    await new Promise(resolve => setTimeout(resolve, 400)); // delay


    /*** 7) create hidden file .gitignore ***/
    console.log('Creating .gitignore');
    const gitignoreContent = await fse.readFile(path.join(__dirname, 'task_templates/basic/gitignore'));
    const filePath5 = path.join(taskFolder, '.gitignore');
    fse.ensureFile(filePath5).then(() => fse.writeFile(filePath5, gitignoreContent, { encoding: 'utf8', flag: 'w' }));

    console.log('\nThe task is downloaded');

  } catch (err) {
    console.log(chalk.red(err.message));
  }


  process.exit();
};


