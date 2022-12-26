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


program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false);


/**
 * Get mikros-cli version.
 * $mik -v
 */
program
  .version(pkg.version)
  .option('-v --version', 'Print mikros version.');


/**
 * Login with username:password and if successful create "conf.js" config file.
 * $mik login
 */
program
  .command('login')
  .description('Login to mikros platform and create "conf.js".')
  .action(login);


/**
 * Logout e.g. delete "conf.js" file.
 * It is recommended to logout when developer finish with development job because "conf.js" file will be deleted with all sensitive data.
 * $mik login
 */
program
  .command('logout')
  .description('Logout e.g. delete "conf.js" file.')
  .action(logout);


/**
 * Initialize new mikros task by coping folder "task_template".
 * $mik init <taskTitle>
 */
program
  .command('init <taskTitle>')
  .description('Initialize new task. Creates folder with initial files.')
  .action(init);


/**
 * Delete complete task. Be careful when using this.
 * $mik delete <taskTitle>
 */
program
  .command('delete <taskTitle>')
  .alias('rm')
  .description('Delete a task. Be careful with this command !!!')
  .action(del);


/**
 * Start the mikros task.
 * $mik start -i input.json
 */
program
  .command('start')
  .option('-i, --input <inp>', 'Select input file, for example "my_input.js".')
  .description('Start mikros task with or without input file.')
  .action(start);


/**
 * Upload the mikros task.
 * $mik upload                 - upload task from current working directory
 * $mik upload -t <taskTitle>   - upload task by name
 * $mik upload -all            - upload all mikros tasks
 */
program
  .command('upload')
  .alias('u')
  .description('Upload mikros task.')
  .option('-t, --task <taskTitle>', 'Upload a task defined by name.')
  .option('-a, --all', 'Upload all mikros tasks.')
  .action(upload);


/**
 * Update the task details.
 * This command will update task details written in manifest.json and howto.html.
 * Although same can be done with "$mik upload" this is much faster because it will not change files.
 * $mik update
 */
program
  .command('update')
  .description('Update task details e.g. manifest.json and howto.html.')
  .action(update);


/**
 * Download the mikros task.
 * $mik download <task_id> - download task to current working directory
 * "task_id" is mongoDB ObjectId , for example: 5e20355c72cdfa2127619493
 */
program
  .command('download <task_id>')
  .alias('d')
  .description('Download mikros task.')
  .action(download);






program.parse(args);
