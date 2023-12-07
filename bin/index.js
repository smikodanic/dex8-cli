#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

const args = process.argv;


const login = require('./login.js');
const logout = require('./logout.js');
const init = require('./init.js');
const del = require('./del.js');
const start = require('./start.js');
const upload = require('./upload.js');
const update = require('./update.js');
const download = require('./download.js');
const bundle = require('./bundle.js');


program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false);


/**
 * Get dex8-cli version.
 * $dex8 -v
 */
program
  .version(pkg.version)
  .option('-v --version', 'Print dex8 version.');


/**
 * Login with username:password and if successful create "conf.js" config file.
 * $dex8 login
 */
program
  .command('login')
  .description('Login to dex8 platform and create "conf.js".')
  .action(login);


/**
 * Logout e.g. delete "conf.js" file.
 * It is recommended to logout when developer finish with development job because "conf.js" file will be deleted with all sensitive data.
 * $dex8 login
 */
program
  .command('logout')
  .description('Logout e.g. delete "conf.js" file.')
  .action(logout);


/**
 * Initialize new dex8 task by coping folder "task_template".
 * $dex8 init <taskTitle>
 */
program
  .command('init <taskTitle>')
  .description('Initialize new task. Creates folder with initial files.')
  .action(init);


/**
 * Delete complete task. Be careful when using this.
 * $dex8 delete <taskTitle>
 */
program
  .command('delete <taskTitle>')
  .alias('rm')
  .description('Delete a task. Be careful with this command !!!')
  .action(del);


/**
 * Start the dex8 task.
 * $dex8 start -i input.json
 */
program
  .command('start')
  .option('-i, --input <inp>', 'Select input file, for example "input_user1.js" or "input_user1.json".')
  .option('-l, --library <lib>', 'Select library file, for example "input_library.js".')
  .option('-b, --bundle', 'Use ./dist/mainBundle.js instead of ./main.js')
  .description('Start dex8 task with or without input file.')
  .action(start);


/**
 * Upload the dex8 task.
 * $dex8 upload                 - upload task from current working directory
 * $dex8 upload -t <taskTitle>   - upload task by name
 * $dex8 upload -all            - upload all dex8 tasks
 */
program
  .command('upload')
  .alias('u')
  .description('Upload dex8 task.')
  .option('-t, --task <taskTitle>', 'Upload a task defined by name.')
  .option('-a, --all', 'Upload all dex8 tasks.')
  .action(upload);


/**
 * Update the task details.
 * This command will update task details written in manifest.json and howto.html.
 * Although same can be done with "$dex8 upload" this is much faster because it will not change files.
 * $dex8 update
 */
program
  .command('update')
  .description('Update task details e.g. manifest.json and howto.html.')
  .action(update);


/**
 * Download the dex8 task.
 * $dex8 download <task_id> - download task to current working directory
 * "task_id" is mongoDB ObjectId , for example: 5e20355c72cdfa2127619493
 */
program
  .command('download <task_id>')
  .alias('d')
  .description('Download dex8 task.')
  .action(download);


/**
 * Bundle main.js and save it in the ./dist/mainBundle.js.
 * $dex8 bundle
 */
program
  .command('bundle')
  .alias('b')
  .description('Bundle dex8 task in the ./dist/mainBundle.js.')
  .action(bundle);






program.parse(args);
