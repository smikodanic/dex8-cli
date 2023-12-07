/**
 * This function will update task details written in manifest.json and howto.html.
 * Altgough same can be done with $dex8 upload this is much faster because it will not change files.
 */
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const { HttpClient } = require('@mikosoft/httpclient-node');
const config = require('../config.js');



const uploadOneTask = async () => {

  try {
    const taskFolder = process.cwd();

    /*** 1) define paths to the conf.js, manifest.json and howto.html ***/
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


    const manifestPath = path.join(taskFolder, 'manifest.json');
    if (!fse.pathExists(manifestPath)) {
      throw new Error(`File "manifest.json" does not exist.`);
    }
    const manifest = await fse.readJson(manifestPath);


    const howtoPath = path.join(taskFolder, 'howto.html');
    if (!fse.pathExists(howtoPath)) {
      throw new Error(`File "howto.html" does not exist.`);
    }
    const howto = await fse.readFile(howtoPath, 'utf8');



    /*** 2) checks ***/
    // check if folder name is same as manifest.title
    if (taskFolder.indexOf(manifest.title) === -1) { throw new Error(`Folder name is not same as manifest.title "${manifest.title}". Please modify "manifest.json" file or change folder name.`); }



    /*** 3) define "body" payload, object which will be sent to API ***/
    const body = manifest;
    body.howto = howto;
    // console.log(body);


    /*** 4) Send POST request to API ***/
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
    const url = config.mainapiBaseURL + '/cli/update';
    const answer = await dhc.askJSON(url, 'POST', body);

    console.log(chalk.green(answer.res.content.msg));

  } catch (err) {
    console.log(chalk.red(err.message));
  }


  process.exit();

};






module.exports = uploadOneTask;
