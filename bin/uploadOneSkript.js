/**
 * This function upload files from a skript.
 * Skript details and skript files are uploaded to mongoDB collections.
 * Bundled Skript is uploaded to the filesystem.
 */
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const { HttpClient } = require('@mikosoft/httpclient-node');
const config = require('../config.js');



const uploadOneSkript = async (skriptTitle) => {

  try {
    /*** 0) define skript folder ***/
    let skriptFolder;
    if (!!skriptTitle) {
      skriptFolder = path.join(process.cwd(), skriptTitle); // if current working directory (cwd) is above skript folder
    } else {
      skriptFolder = process.cwd();
    }


    // check if skriptFolder is folder
    const stat = await fse.lstat(skriptFolder).catch(console.log);
    if (stat.isFile()) { throw new Error(`"${skriptFolder}" is a file. It should be a folder.`); }
    console.log('skript folder: ', skriptFolder);

    const tf1 = await fse.pathExists(skriptFolder);
    if (!tf1) { skriptFolder = path.join(process.cwd(), `../${skriptTitle}`); }

    const tf2 = await fse.pathExists(skriptFolder);
    if (!tf2) { throw new Error(`Folder "${skriptFolder}" does not exists.`); }


    // define path to dex8auth.json
    let dex8auth_path;
    const tf3 = await fse.pathExists(path.join(skriptFolder, 'dex8auth.json'));
    if (tf3) {
      dex8auth_path = path.join(skriptFolder, 'dex8auth.json');
    } else {
      const tf4 = await fse.pathExists(path.join(skriptFolder, '../', 'dex8auth.json')); // watch in upper directory
      if (tf4) {
        dex8auth_path = path.join(skriptFolder, '../', 'dex8auth.json');
      } else { throw new Error(`File "dex8auth.json" is not created. Please login.`); }
    }


    const dex8auth = await fse.readJson(dex8auth_path);
    console.log(`username: ${dex8auth.username} (${dex8auth.user_id})`);


    /*** 1) get files for upload ***/
    let upfiles = await fse.readdir(skriptFolder);

    // remove files which are not needed for upload process
    upfiles = upfiles.filter(uf => (
      uf !== 'manifest.json' &&
      uf !== 'dex8auth.json' &&
      uf !== 'package-lock.json' &&
      uf !== 'node_modules' &&
      uf !== 'tmp' &&
      uf !== 'dist'
    ));
    // console.log('upfiles:: ', upfiles); // upfiles:: [ 'f1.js', 'howto.html', 'input.js', 'main.js', 'manifest.json' ]


    /*** 2) read manifest ***/
    const manifestPath = path.join(skriptFolder, 'manifest.json');
    const manifest = await fse.readJson(manifestPath);
    if (!manifest) { throw new Error('Uploaded skript must contain "manifest.json" file.'); }


    /*** 3) checks ***/
    // check if files contain 'main.js' file
    const hasMain = upfiles.find(fName => fName === 'main.js');
    if (!hasMain) { throw new Error('Uploaded skript must contain "main.js" file.'); }

    // check if folder name is same as manifest.title
    if (!skriptFolder.includes(manifest.title)) { throw new Error(`Folder name is not same as manifest.title "${manifest.title}". Please modify "manifest.json" file or change folder name.`); }

    // check if dist/mainBundle.js exists
    const mainBundlePath = path.join(skriptFolder, './dist/mainBundle.js');
    if (!fse.pathExistsSync(mainBundlePath)) { throw new Error('No dist/mainBundle.js. Use command $dex8 bundle.'); }

    /*** 4) define "body" payload, object which will be sent to API ***/
    const body = {
      ...manifest, // title,description,category,thumbnail,environment
      skriptFiles: [],
      inputs: [],
      inputSecrets: [],
      mainBundle: ''
    };

    /*** 5) read files ***/
    for (const name of upfiles) {
      const filePath = path.join(skriptFolder, name);
      if (fse.lstatSync(filePath).isDirectory()) { continue; } // do not take directories

      if (/^input(?!Secret).*\.json/.test(name)) {
        console.log(' Reading input file:', name);
        const val = await fse.readJson(filePath, 'utf8');
        if (!val) { throw new Error(`Empty val in ${name}`); }
        body.inputs.push({ name, val });
      } else if (/^inputSecret.*\.json/.test(name)) {
        console.log(' Reading secret input file:', name);
        const val = await fse.readJson(filePath, 'utf8');
        body.inputSecrets.push({ name, val });
      } else {
        console.log(' Reading file:', name);
        const content = await fse.readFile(filePath, 'utf8');
        if (!content) { throw new Error(`Empty content in ${name}`); }
        body.skriptFiles.push({ name, content });
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }


    await new Promise(resolve => setTimeout(resolve, 500));


    /*** 6) read /dist/mainBundle.js ***/
    console.log(' Reading  dist/mainBundle.js');
    body.mainBundle = await fse.readFile(mainBundlePath, 'utf8');


    console.log(`Uploading ${body.inputs.length} inputs, ${body.inputSecrets.length} secret inputs, ${body.skriptFiles.length} files and main bundle ${body.mainBundle.length} bytes`,);


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
        'authorization': dex8auth.jwtToken,
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

    const url = config.mainapiBaseURL + '/cli/upload';
    const answer = await dhc.askJSON(url, 'POST', body);

    // status
    const errMsg = answer.res.content && answer.res.content.error_message ? answer.res.content.error_message : answer.statusMessage;
    if (answer.status !== 200) { throw new Error(errMsg); }

    console.log(chalk.green(answer.res.content.msg));

  } catch (err) {
    console.log(chalk.red(err.message));
  }

};






module.exports = uploadOneSkript;
