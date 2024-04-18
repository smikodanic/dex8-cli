/**
 * Fill login form with username/password and click LogIn button.
 */

module.exports = async (x, lib) => {
  const ff = lib.ff;
  const echo = lib.echo;
  const page = lib.page;
  const inputSecret = lib.inputSecret;

  const email = inputSecret.fb_email;
  const password = inputSecret.fb_password;


  await echo.log('----- login -----');

  // additional login fields
  const url_success = 'https://www.facebook.com'; // URL after successful login
  const sel_success = 'div[aria-label="Account Controls and Settings"]';
  const email_cssSelector = 'input#email';
  const password_cssSelector = 'input#pass';
  const button_cssSelector = 'button[name="login"]';


  // fill the email field
  await ff.delay(800);
  await echo.log(`Typing email: ${email}`);
  const email_EH = await page.waitForSelector(email_cssSelector, { timeout: 21000 }).catch(err => console.log(err.message));
  await email_EH.evaluate(email_elem => email_elem.value = ''); // empty input field
  await page.click(email_cssSelector);
  await page.keyboard.type(email);


  // fill the password field
  await ff.delayRnd(800, 1300);
  await echo.log('Typing password');
  await page.click(password_cssSelector);
  await page.keyboard.type(password);


  // button click
  await ff.delayRnd(1300, 2100);
  await echo.log('Click "Log In" button.');
  await page.click(button_cssSelector);


  // protect login credentials after login
  inputSecret.fb_password = '--removed--';


  // define login_success
  const url = page.url(); // get URL after login, e.g. after login button is clicked
  const reg = new RegExp(url_success, 'i');
  const elem = await page.waitForSelector(sel_success, 3000).catch(console.log); // check if element exists after successful login
  x.login_success = reg.test(url) && !!elem;


  if (x.login_success) {
    await echo.log('Login OK.');
  } else {
    await echo.log('Login BAD.');
    ff.stop();
  }


  return x;
};
