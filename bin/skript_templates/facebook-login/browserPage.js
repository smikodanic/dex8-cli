const PptrPlus = require('pptr-plus');


/**
 * Open the browser and a tab.
 */
module.exports = async (x, lib) => {
  const ff = lib.ff;
  const echo = lib.echo;
  const sysconfig = lib.sysconfig;

  await echo.log('----- browserPage ----');
  await echo.log('Platform: ', sysconfig.osPlatform);
  await echo.log('Device: ', sysconfig.device);
  await echo.log('Puppeteer: ', sysconfig.puppeteer);

  // start the browser
  const browser = await lib.puppeteer.launch(sysconfig.puppeteer).catch(err => echo.error(err));

  // open a tab
  // const page = await browser.newPage(); // open page in the second tab
  const page = (await browser.pages())[0]; // open page in the first tab
  await page.emulate(sysconfig.device);
  await page.bringToFront();


  const width = sysconfig.device.viewport.width;
  const height = sysconfig.device.viewport.height;
  await page.setViewport({ width, height });

  // pptr-plus
  const pptrPlus = new PptrPlus(page);

  ff.libAdd({ browser, page, pptrPlus });

  return x;
};
