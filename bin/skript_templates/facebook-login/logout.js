module.exports = async (x, lib) => {
  const echo = lib.echo;
  const page = lib.page;
  const ff = lib.ff;
  const pptrPlus = lib.pptrPlus;

  await echo.log('----- logout -----');

  // click on arrow to open dropdown menu
  const span_EH = await page.waitForSelector('div[aria-label="Account Controls and Settings"] > span', { timeout: 5000 }).catch(err => console.log(err.message));
  await span_EH.click();

  await ff.delay(1300);

  // click on Logout button
  await pptrPlus.clickElemWithText('//span', 'Log Out');
  await echo.log('clicked "Log Out"');

  return x;
};
