const PptrPlus = require('pptr-plus');
const os = require('os');
const path = require('path');
const fs = require('fs');


/**
 * Open the browser and a tab.
 */
module.exports.browser_open = async (x, lib) => {
  const { ff, echo, input } = lib;
  const headless = input.headless;
  const userAgent = input.userAgent ?? 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
  const cookie_file = input.cookie_file;

  /*** start the browser ***/
  // define chrome executable path
  const osPlatform = os.platform(); // possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
  let executablePath;
  if (/^win/i.test(osPlatform)) {
    executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (/^linux/i.test(osPlatform)) {
    executablePath = '/usr/bin/google-chrome';
  } else if (/^darwin/i.test(osPlatform)) {
    executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }

  const pptrConf = {
    executablePath,
    headless,
    defaultViewport: null, // ensure Puppeteer doesn't override your viewport settings
    args: [
      '--start-maximized', // this flag maximizes the browser window
      `--display=${process.env.DISPLAY ?? ':10.0'}` // fix for LXDE desktops
    ],
    ignoreDefaultArgs: ['--enable-automation'] // remove "Chrome is being controlled by automated test software"
  };
  const browser = await lib.puppeteer.launch(pptrConf).catch(err => echo.error(err));

  /*** open a tab ***/
  // const page = await browser.newPage(); // open page in the second tab
  const page = (await browser.pages())[0]; // open page in the first tab
  await page.bringToFront();


  /*** get screen dimensions using page.evaluate ***/
  const screenDimensions = await page.evaluate(() => {
    return {
      width: window.screen.availWidth,
      height: window.screen.availHeight
    };
  });


  /*** set viewport to the maximum screen dimensions ***/
  await page.setViewport({
    width: screenDimensions.width,
    height: screenDimensions.height
  });


  /*** set user-agent ***/
  await page.setUserAgent(userAgent);
  await echo.log(` userAgent: ${userAgent}`);


  /*** override navigator.webdriver to false (navigator.languages, navigator.plugins) ***/
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(window.navigator, 'webdriver', {
      get: () => false,
    });
  });
  const isWebdriverFalse = await page.evaluate(() => window.navigator.webdriver === false); // check if navigator.webdriver is set to false
  await echo.log(' navigator.webdriver is set to false:', isWebdriverFalse ? 'YES' : 'NO');


  /*** pptr-plus ***/
  const pptrPlus = new PptrPlus(page);
  ff.libAdd({ browser, page, pptrPlus });


  /*** set cookie, local and session storage before navigating to the page (Cloudflare protection) ***/
  const cookie_path = path.join(__dirname, cookie_file);
  if (fs.existsSync(cookie_path)) {
    await pptrPlus.cookieTake(cookie_path);
    await echo.log(` cookies loaded from ${cookie_file}`);
  } else {
    await echo.warn(` no cookie file ${cookie_file}`);
  }


  // const localStorage_path = path.join(__dirname, 'www.dex8.com.localStorage.json');
  // await pptrPlus.storageTake(localStorage_path, 'localStorage');

  // const sessionStorage_path = path.join(__dirname, 'www.dex8.com.sessionStorage.json');
  // await pptrPlus.storageTake(sessionStorage_path, 'sessionStorage');



  return x;
};


/**
 * Close the browser
 */
module.exports.browser_close = async (x, lib) => {
  const browser = lib.browser;
  const echo = lib.echo;

  echo.log('--- browserClose ---');

  await browser.close();
  echo.log('Browser closed.');

  return x;
};
