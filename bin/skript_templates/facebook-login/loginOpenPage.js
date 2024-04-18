/**
 * Open the FB login page.
 */
module.exports = async (x, lib) => {
  const echo = lib.echo;
  const page = lib.page;

  const loginURL = 'https://www.facebook.com/login';

  await echo.log('----- loginOpenPage -----');

  await echo.log(`Opening login page ${loginURL} ...`);
  await page.goto(loginURL, { timeout: 30000 });


  // close popup "Accept cookies from Facebook on this browser?"
  const btn_EH = await page.waitForSelector('button[data-testid="cookie-policy-manage-dialog-accept-button"], div[aria-label="Allow all cookies"][tabindex="0"]', { timeout: 8000 }).catch(err => console.log(err.message));
  if (!!btn_EH) {
    btn_EH.click();
    await echo.log('Closed popup "Allow all cookies"');
  }

  return x;
};
