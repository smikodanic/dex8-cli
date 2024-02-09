/**
 * Start dex8 skript from command line.
 * $ dex8 start -i input.json
 */
const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const moment = require('moment');
const { EventEmitter } = require('events');
const print = require('./helper_print');


/**
 * Get present time in short format
 */
const shortNow = () => {
  return moment().format('D.M.YYYY h:m:s');
};



module.exports = async (optionsObj) => {
  // option values
  const input_selected = optionsObj.input;
  const inputSecret_selected = optionsObj.inputSecret;
  const isBundled = optionsObj.bundle;


  /**** 1) GET manifest.json ****/
  const manifestPath = path.join(process.cwd(), 'manifest.json');
  const manifest = require(manifestPath);


  /**** 2) GET SKRIPT TITLE ****/
  const skript_title = manifest.title;


  /**** 3) START message ****/
  console.log(chalk.bgGreen(`Skript "${skript_title}" started on ${shortNow()}`));


  /**** 4) Fetch main function ****/
  let main;
  if (isBundled) {
    console.log(chalk.bgGreen(`The bundled skript is used.`));
    const mainBundlePath = path.join(process.cwd(), './dist/mainBundle.js');
    const mainBundleExists = await fse.pathExists(mainBundlePath);
    if (!mainBundleExists) { console.log(chalk.red(`Skript "${skript_title}" does not have "dist/mainBundle.js" file. Use command: $dex8 bundle`)); return; }
    main = require(mainBundlePath);
  } else {
    const mainPath = path.join(process.cwd(), 'main.js');
    const mainExists = await fse.pathExists(mainPath);
    if (!mainExists) { console.log(chalk.red(`Skript "${skript_title}" does not have "main.js" file.`)); return; }
    // delete require.cache[mainPath];
    main = require(mainPath);
  }


  /**** 5) Fetch input.json ****/
  let input;
  if (!!input_selected) {
    const input_selectedPath = path.join(process.cwd(), input_selected);
    const inputExists = await fse.pathExists(input_selectedPath);
    if (inputExists) { input = require(input_selectedPath); }
  }


  /**** 6) Fetch inputSecret.json  (inputSecret.json is gitignored and encoded in MongoDB) ****/
  let inputSecret;
  if (!!inputSecret_selected) {
    const inputSecret_selectedPath = path.join(process.cwd(), inputSecret_selected);
    const inputSecretExists = await fse.pathExists(inputSecret_selectedPath);
    if (inputSecretExists) { inputSecret = require(inputSecret_selectedPath); }
  }


  /**** 7) event emmiter in global vriable ****/
  const eventEmitter = new EventEmitter();
  eventEmitter.setMaxListeners(5); // 10 by default
  global.dex8 = { eventEmitter };


  /**** 8) EXECUTE main ****/
  try {
    const output = await main(input, inputSecret);
    console.log(chalk.bgGreen(`Skript "${skript_title}" is ended on ${shortNow()}`));
    console.log('output:: ');
    print(output);
  } catch (err) {
    console.log(chalk.bgRed(`Skript "${skript_title}" exited with error on ${shortNow()}`));
    console.log(err);
  }


};
