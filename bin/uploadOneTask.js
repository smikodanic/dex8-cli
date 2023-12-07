/**
 * This function upload files from a task.
 * Task and files are uploaded to mongoDB collections.
 */
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const { HttpClient } = require('@mikosoft/httpclient-node');
const config = require('../config.js');



const uploadOneTask = async (taskName) => {

  try {
    /*** 0) define task folder ***/
    let taskFolder;
    if (!!taskName) {
      taskFolder = path.join(process.cwd(), taskName); // if current working directory (cwd) is above task folder
    } else {
      taskFolder = process.cwd();
    }


    // check if taskFolder is folder
    const stat = await fse.lstat(taskFolder);
    if (stat.isFile()) { throw new Error(`"${taskFolder}" is a file. It should be a folder.`); }
    console.log('task folder: ', taskFolder);

    const tf1 = await fse.pathExists(taskFolder);
    if (!tf1) { taskFolder = path.join(process.cwd(), `../${taskName}`); }

    const tf2 = await fse.pathExists(taskFolder);
    if (!tf2) { throw new Error(`Folder "${taskFolder}" does not exists.`); }


    // define path to conf.js
    let confPath;
    const tf3 = await fse.pathExists(path.join(taskFolder, 'conf.js'));
    if (tf3) {
      confPath = path.join(taskFolder, 'conf.js');
    } else {
      const tf4 = await fse.pathExists(path.join(taskFolder, '../', 'conf.js')); // watch in upper directory
      if (tf4) {
        confPath = path.join(taskFolder, '../', 'conf.js');
      } else { throw new Error(`File "conf.js" is not created. Please login.`); }
    }


    const conf = require(confPath);
    console.log(`username: ${conf.username} (${conf.user_id})`);
    // console.log('conf:: ', conf);


    /*** 1) get files for upload ***/
    let upfiles = await fse.readdir(taskFolder);

    // remove files which are not needed for upload process
    upfiles = upfiles.filter(uf => (
      uf !== '.editorconfig' &&
      uf !== '.eslintrc' &&
      uf !== '.gitignore' &&
      uf !== 'conf.js' &&
      uf !== 'node_modules' &&
      uf !== 'tmp' &&
      uf !== 'dist' &&
      uf !== 'package-lock.json'
    ));
    // console.log('upfiles:: ', upfiles); // upfiles:: [ 'f1.js', 'howto.html', 'input.js', 'main.js', 'manifest.json' ]


    /*** 2) read manifest ***/
    const manifestPath = path.join(taskFolder, 'manifest.json');
    const manifest = await fse.readJson(manifestPath);
    // console.log(manifest);


    /*** 3) checks ***/
    // check if upfiles contain 'manifest.json' file
    const hasManifest = upfiles.find(fName => fName === 'manifest.json');
    if (!hasManifest) { throw new Error('Uploaded task must contain "manifest.json" file.'); }

    // check if files contain 'main' file
    const hasMain = upfiles.find(fName => fName === 'main.js');
    if (!hasMain) { throw new Error('Uploaded task must contain "main.js" file.'); }

    // check if folder name is same as manifest.title
    if (taskFolder.indexOf(manifest.title) === -1) { throw new Error(`Folder name is not same as manifest.title "${manifest.title}". Please modify "manifest.json" file or change folder name.`); }

    // check if dist/mainBundle.js exists
    const mainBundlePath = path.join(taskFolder, './dist/mainBundle.js');
    if (!fse.pathExistsSync(mainBundlePath)) { throw new Error('No dist/mainBundle.js. Use command $dex8 bundle.'); }

    /*** 4) define "body" payload, object which will be sent to API ***/
    const body = manifest;

    /*** 5) read files ***/
    body.files = []; // init body.files array
    for (let i = 0; i < upfiles.length; i++) {
      const fileName = upfiles[i]; // ['fileName']
      console.log(' Reading ', fileName);

      const filePath = path.join(taskFolder, fileName);
      fse.readFile(filePath, 'utf8')
        .then(fileContent => {
          if (!fileContent) { console.log(chalk.yellow(`---File ${fileName} is empty and will not be uploaded. Delete the file.`)); return; } // do not upload empty files
          if (fileName === 'manifest.json') { return; }

          if (fileName === 'howto.html') { // upload howto.html
            body.howto = fileContent;
          } else if (/.+(\.js|\.json|\.csv)$/.test(fileName)) { // upload js, json, csv files
            body.files.push({ name: fileName, content: fileContent });
          }

        })
        .catch(err => console.log(chalk.red(err.message)));

      await new Promise(resolve => setTimeout(resolve, 400)); // some time delay to read file and perform operations
    } // \for


    await new Promise(resolve => setTimeout(resolve, 400)); // some additional time delay before API request


    /*** 6) read /dist/mainBundle.js ***/
    console.log(' Reading  dist/mainBundle.js');
    body.mainBundle = await fse.readFile(mainBundlePath, 'utf8');


    console.log(`Uploading ${body.files.length} files`, body.files.map(file => file.name));


    /*** Send POST request to API ***/
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
        'accept': '*/*', // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
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
    const url = config.mainapiBaseURL + '/cli/upload';
    const answer = await dhc.askJSON(url, 'POST', body);

    if (answer.status === 200) {
      console.log(chalk.green(answer.res.content.msg));
    } else {
      console.log(chalk.red(answer.statusMessage));
      console.log(chalk.red(answer.res.content.message));
    }

    await new Promise(resolve => setTimeout(resolve, 1300));
    process.exit();


  } catch (err) {
    console.log(chalk.red(err.message));
    // console.log(err);
    process.exit();
  }




};






module.exports = uploadOneTask;
