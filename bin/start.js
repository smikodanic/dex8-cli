/**
 * Start dex8 task from command line.
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
  const input_selected = optionsObj.input;
  const library_selected = optionsObj.library;


  /**** 1) GET manifest.json ****/
  const manifestPath = path.join(process.cwd(), 'manifest.json');
  const manifest = require(manifestPath);


  /**** 2) GET TASK TITLE ****/
  const task_title = manifest.title;


  /**** 3) START message ****/
  console.log(`Task "${task_title}" started on ${shortNow()}\n`);


  /**** 4) Fetch main function ****/
  const mainPath = path.join(process.cwd(), 'main.js');
  const mainExists = await fse.pathExists(mainPath);
  if (!mainExists) { console.log(chalk.red(`Task "${task_title}" does not have "main.js" file.`)); return; }
  // delete require.cache[mainPath];
  const main = require(mainPath);


  /**** 5) Fetch input ****/
  let input;
  if (!!input_selected) {
    const input_selectedPath = path.join(process.cwd(), input_selected);
    const inputExists = await fse.pathExists(input_selectedPath);
    if (!inputExists) { console.log(chalk.red(`Input file does not exists: ${input_selected}`)); return; }
    // delete require.cache[input_selectedPath];
    input = require(input_selectedPath);
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
    const output = await main(input, library);
    console.log(`\nTask "${task_title}" is ended on ${shortNow()}`);
    console.log('output:: ', output);
  } catch (err) {
    console.log(`\nTask "${task_title}" exited with error on ${shortNow()}`);
    console.log(err);
  }


};
