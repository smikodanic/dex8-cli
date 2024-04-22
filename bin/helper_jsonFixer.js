/**
 * FIX ERROR: key $exists must not start with '$' , for example when uploading input.json with {"$gte": 20}
 * @param {object} obj
 */

// convert "$ -> "__$
module.exports.dollarModify = obj => {
  let json = JSON.stringify(obj);
  json = json.replace(/\"\$/g, '"__$');
  const obj_fixed = JSON.parse(json);
  return obj_fixed;
};

// return to original i.e. from "__$ to "$
module.exports.dollarUnmodify = obj => {
  let json = JSON.stringify(obj);
  json = json.replace(/\"\_\_\$/g, '"$');
  const obj_original = JSON.parse(json);
  return obj_original;
};
