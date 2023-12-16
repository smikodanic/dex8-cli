/**
 * Upload DEX8 task from command line.
 * $ dex8 upload                    -> if we are in the task folder
 * $ dex8 upload -t <taskTitle>      -> if we are above task folder
 * $ dex8 upload --all              -> if we are above task folder
 */
const fse = require('fs-extra');
const uploadOneTask = require('./uploadOneTask');


module.exports = async (optionsObj) => {
  // option values
  const taskTitle = optionsObj.task; // string | undefined
  const all = optionsObj.all; // boolean | undefined


  if (!all) {
    await uploadOneTask(taskTitle);

  } else {
    /*** 1) get task_names e.g. folder names ***/
    const items = await fse.readdir('./', { withFileTypes: true });
    const folders = items.filter(item => item.isDirectory()).map(folder => folder.name);

    /*** 2) uploading tasks one by one ***/
    let i = 1;
    for (const taskTitle of folders) {
      if (
        taskTitle !== '.git' &&
        taskTitle !== '.gitignore' &&
        taskTitle !== 'dex8auth.json' &&
        taskTitle !== 'package-lock.json' &&
        taskTitle !== 'node_modules' &&
        taskTitle !== 'tmp'
      ) {
        console.log(`\n============== ${i}. Uploading task "${taskTitle}" ... ==============`);
        i++;
        await uploadOneTask(taskTitle);
      }

    }

  }

  process.exit();

};
