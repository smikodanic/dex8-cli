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
 * Login with username:password and if successful create "dex8auth.json" file.
 * $ dex8 login
 */
program
  .command('login')
  .description('Login to dex8 platform and create "dex8auth.json".')
  .action(login);


/**
 * Logout e.g. delete "dex8auth.json" file.
 * It is recommended to logout when developer finish with development job because "dex8auth.json" file will be deleted with all sensitive data.
 * $ dex8 logout
 */
program
  .command('logout')
  .description('Logout e.g. delete "dex8auth.json" file.')
  .action(logout);


/**
 * Initialize new dex8 skript by coping folder "skript_templates/...".
 * $ dex8 init
 */
program
  .command('init')
  .alias('i')
  .description('Initialize new skript. Create folder with initial files.')
  .action(init);


/**
 * Delete complete skript. Be careful when using this.
 * $dex8 delete <skriptTitle>
 */
program
  .command('delete <skriptTitle>')
  .description('Delete a skript. Be careful with this command !')
  .action(del);


/**
 * Bundle main.js and save it in the ./dist/mainBundle.js.
 * $dex8 bundle
 */
program
  .command('bundle')
  .alias('b')
  .description('Bundle dex8 skript in the ./dist/mainBundle.js.')
  .action(bundle);


/**
 * Start the dex8 skript.
 * $dex8 start -i input.json
 */
program
  .command('start')
  .alias('s')
  .option('-i, --input <inp>', 'Select input file, for example "input.json".')
  .option('-is, --inputSecret <inpSec>', 'Select inputSecret file, for example "inputSecret.json".')
  .option('-b, --bundle', 'Use ./dist/mainBundle.js instead of ./main.js')
  .description('Start dex8 skript with or without input file.')
  .action(start);


/**
 * Upload the dex8 skript.
 * $dex8 upload                 - upload skript from current working directory
 * $dex8 upload -t <skriptTitle>   - upload skript by name
 * $dex8 upload -all            - upload all dex8 skripts
 */
program
  .command('upload')
  .alias('u')
  .description('Upload dex8 skript.')
  .option('-s, --skript <skriptTitle>', 'Upload a skript defined by title.')
  .option('-a, --all', 'Upload all dex8 skripts.')
  .action(upload);


/**
 * Update the skript details.
 * This command will update skript details written in manifest.json.
 * Although same can be done with "$dex8 upload" this is much faster because it will not change files.
 * $dex8 update
 */
program
  .command('update')
  .description('Update skript details e.g. manifest.json.')
  .action(update);


/**
 * Download the dex8 skript.
 * $dex8 download <skript_id> - download skript to current working directory
 * "skript_id" is mongoDB ObjectId , for example: 5e20355c72cdfa2127619493
 */
program
  .command('download <skript_id>')
  .alias('d')
  .description('Download dex8 skript.')
  .action(download);






program.parse(args);
