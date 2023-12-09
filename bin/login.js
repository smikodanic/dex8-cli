const inquirer = require('inquirer');
const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const { HttpClient } = require('@mikosoft/httpclient-node');
const config = require('../config.js');



module.exports = async () => {

  const questions = [
    { type: 'input', name: 'username', message: 'username:', default: '' },
    { type: 'password', name: 'password', message: 'password', default: '' }
  ];

  try {

    // init httpClient
    const opts = {
      encodeURI: false,
      encoding: 'utf8',
      timeout: 90000,
      retry: 1,
      retryDelay: 2100,
      maxRedirects: 0,
      headers: {
        'authorization': '',
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
    const url = config.mainapiBaseURL + '/cli/login';
    const body = await inquirer.prompt(questions); // {username, passsword}
    const answer = await dhc.askJSON(url, 'POST', body);

    // status
    if (answer.status !== 200) { throw new Error(answer.res.content.message); }


    // create config file
    const filePath = path.join(process.cwd(), 'dex8auth.json');
    const fileContent = JSON.stringify(answer.res.content, null, 2);
    await fse.ensureFile(filePath);
    await fse.writeFile(filePath, fileContent, { encoding: 'utf8' });

    if (fse.pathExists(filePath)) {
      console.log(`Login was successful and ${filePath} was created.`);
    }


  } catch (err) {
    console.log(chalk.red(err.message));
  }

  process.exit();
};
