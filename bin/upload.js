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
    uploadOneTask(taskTitle);

  } else {
    /*** 1) get task_names e.g. folder names ***/
    const folders = await fse.readdir('./');
    // console.log('folders:: ', folders);

    /*** 2) uploading tasks one by one ***/
    let i = 1;
    for (const taskTitle of folders) {
      if (taskTitle !== 'dex8-auth.json' && taskTitle !== '.git' && taskTitle !== '.gitignore') {
        console.log(`\n============== ${i}. Uploading task "${taskTitle}" ... ==============`);
        i++;
        await uploadOneTask(taskTitle);
      }

    }

  }

};
