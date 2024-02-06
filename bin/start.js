/**
 * Start dex8 skript from command line.
 * $ dex8 start -i input.json
 */
const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const moment = require('moment');
const { EventEmitter } = require('events');


/**
 * Get present time in short format
 */
const shortNow = () => {
  return moment().format('D.M.YYYY h:m:s');
};



module.exports = async (optionsObj) => {
  // option values
  const input_selected = optionsObj.input || 'input.json';
  const inputSecret_selected = optionsObj.inputSecret || 'inputSecret.json';
  const library_selected = optionsObj.library;
  const isBundled = optionsObj.bundle;


  /**** 1) GET manifest.json ****/
  const manifestPath = path.join(process.cwd(), 'manifest.json');
  const manifest = require(manifestPath);


  /**** 2) GET SKRIPT TITLE ****/
  const skript_title = manifest.title;


  /**** 3) START message ****/
  console.log(`Skript "${skript_title}" started on ${shortNow()}\n`);


  /**** 4) Fetch main function ****/
  let main;
  if (isBundled) {
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


  /**** 5) Fetch input.json and inputSecret.json  (inputSecret.json is gitignored) ****/
  const input_selectedPath = path.join(process.cwd(), input_selected);
  const inputExists = await fse.pathExists(input_selectedPath);
  if (!inputExists) { console.log(chalk.red(`Input file does not exists: ${input_selected}`)); return; }
  // delete require.cache[input_selectedPath];
  const input = require(input_selectedPath);
  if (typeof input !== 'object') { console.log(chalk.red(`Input is ${typeof input}. It should be an object.`)); return; }
  if (Array.isArray(input)) { console.log(chalk.red('Input is array and it should be an object.')); return; }


  const inputSecret_selectedPath = path.join(process.cwd(), inputSecret_selected);
  const inputSecretExists = await fse.pathExists(inputSecret_selectedPath);
  let inputJoined;
  if (inputSecretExists) {
    const inputSecret = require(inputSecret_selectedPath);
    if (input) { inputJoined = { ...input, ...inputSecret }; }
  } else {
    console.log(chalk.red(`Input Secret file does not exists: ${inputSecret_selected}`)); return;
  }


  /**** 6) Fetch library ****/
  let library;
  if (!!library_selected) {
    const library_selectedPath = path.join(process.cwd(), library_selected);
    const libraryExists = await fse.pathExists(library_selectedPath);
    if (!libraryExists) { console.log(chalk.red(`Library file does not exists: ${library_selected}`)); return; }
    // delete require.cache[library_selectedPath];
    library = require(library_selectedPath);
  } else {
    const eventEmitter = new EventEmitter();
    eventEmitter.setMaxListeners(5); // 10 by default
    library = { eventEmitter };
  }


  /**** 7) EXECUTE main ****/
  try {
    const output = await main(inputJoined, library);
    console.log(`\nSkript "${skript_title}" is ended on ${shortNow()}`);
    console.log('output:: ', output);
  } catch (err) {
    console.log(`\nSkript "${skript_title}" exited with error on ${shortNow()}`);
    console.log(err);
  }


};
