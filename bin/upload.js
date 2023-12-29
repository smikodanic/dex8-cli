/**
 * Upload DEX8 skript from command line.
 * $ dex8 upload                    -> if we are in the skript folder
 * $ dex8 upload -t <skriptTitle>      -> if we are above skript folder
 * $ dex8 upload --all              -> if we are above skript folder
 */
const fse = require('fs-extra');
const uploadOneSkript = require('./uploadOneSkript');


module.exports = async (optionsObj) => {
  // option values
  const skriptTitle = optionsObj.skript; // string | undefined
  const all = optionsObj.all; // boolean | undefined


  if (!all) {
    await uploadOneSkript(skriptTitle);

  } else {
    /*** 1) get skript_names e.g. folder names ***/
    const items = await fse.readdir('./', { withFileTypes: true });
    const folders = items.filter(item => item.isDirectory()).map(folder => folder.name);

    /*** 2) uploading skripts one by one ***/
    let i = 1;
    for (const skriptTitle of folders) {
      if (
        skriptTitle !== '.git' &&
        skriptTitle !== '.gitignore' &&
        skriptTitle !== 'dex8auth.json' &&
        skriptTitle !== 'package-lock.json' &&
        skriptTitle !== 'node_modules' &&
        skriptTitle !== 'tmp'
      ) {
        console.log(`\n============== ${i}. Uploading skript "${skriptTitle}" ... ==============`);
        i++;
        await uploadOneSkript(skriptTitle);
      }

    }

  }

  process.exit();

};
