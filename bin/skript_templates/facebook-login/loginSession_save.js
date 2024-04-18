/**
 * Save cookies, localStorage and sessionStorage in the 'loginSessions' mongo collection
 */
module.exports = async (x, lib) => {
  const echo = lib.echo;
  const page = lib.page;
  const mongofast = lib.mongofast;
  const fb_email = lib.inputSecret.fb_email;


  await echo.log(`+++++ loginSession_save +++++`);

  // get cookies, local and session storage
  const cookies = await page.cookies(); // array
  const localStorage = await page.evaluate(() => Object.assign({}, window.localStorage));
  const sessionStorage = await page.evaluate(() => Object.assign({}, window.sessionStorage));


  // save login session
  await mongofast.useModel('facebook_login_sessions');

  const moQuery = { fb_email };
  const docNew = { fb_email, cookies, localStorage, sessionStorage };
  const updOpts = {
    new: true, // return updated document as 'result'
    upsert: true, // whether to create the doc if it doesn't match (false)
    runValidators: false, // validators validate the update operation against the model's schema
    strict: false, // values not defined in schema will not be saved in db (default is defined in schema options, and can be overwritten here)
    // sort: {created_at: -1} // if multiple results are found, sets the sort order to choose which doc to update
  };
  const loginSession_doc = await mongofast.editOne(moQuery, docNew, updOpts);

  await echo.log(`Login session is saved. cookies: ${cookies.length}, localStorage: ${localStorage ? Object.keys(localStorage).length : 0}, sessionStorage: ${sessionStorage ? Object.keys(sessionStorage).length : 0}`);

  return x;
};
