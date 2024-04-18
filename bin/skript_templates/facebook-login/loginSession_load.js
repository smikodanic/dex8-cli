/**
 * Take cookies, localStorage and sessionStorage from the 'loginSessions' mongo collection and set it in the browser.
 */
module.exports = async (x, lib) => {
  const echo = lib.echo;
  const ff = lib.ff;
  const page = lib.page;
  const mongofast = lib.mongofast;
  const fb_email = lib.inputSecret.fb_email;


  await echo.log(`----- loginSession_load -----`);


  // take cookies, local and session storage
  await mongofast.useModel('facebook_login_sessions');

  const moQuery = { fb_email };
  const loginSession_doc = await mongofast.getOne(moQuery);
  if (!loginSession_doc) { return x; }

  const cookies_arr = loginSession_doc.cookies;
  const localStorage_obj = loginSession_doc.localStorage;
  const sessionStorage_obj = loginSession_doc.sessionStorage;


  // set cookies in the browser
  for (const cookie of cookies_arr) {
    await page.setCookie(cookie);
  }

  // set local and session storage
  await page.evaluate((localStorage_obj, sessionStorage_obj) => {
    for (const [key, value] of Object.entries(localStorage_obj)) {
      window.localStorage.setItem(key, value);
    }
    for (const [key, value] of Object.entries(sessionStorage_obj)) {
      window.sessionStorage.setItem(key, value);
    }
  }, localStorage_obj, sessionStorage_obj);


  // page reload to take the login session efect
  await ff.delayRnd(2100, 3400);
  await page.reload();
  await echo.log(' page reloaded');

  await echo.log(` Login session is loaded. cookies: ${cookies_arr.length}, localStorage: ${localStorage_obj ? Object.keys(localStorage_obj).length : 0}, sessionStorage: ${sessionStorage_obj ? Object.keys(sessionStorage_obj).length : 0}`);


  // detect autologin (CSS selector is same as in logout.js)
  const span_EH = await page.waitForSelector('div[aria-label="Account Controls and Settings"] > span', { timeout: 5000 }).catch(err => console.log(err.message));
  if (!!span_EH) {
    await echo.log(' + Autologin was succesful.');
    ff.next(); // go to next ff.serial()
  } else {
    await echo.log(' - Autologin was not succesful. Continue with login email and password.');
  }


  return x;
};
