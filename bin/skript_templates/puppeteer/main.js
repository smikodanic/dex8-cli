const FunctionFlow = require('@mikosoft/functionflow');
const Echo = require('@mikosoft/echo');
const puppeteer = require('puppeteer-core');
const systemConfig = require('./systemConfig.js');


// functions
const { browser_open, browser_close } = require('./browser.js');
const pageOpen = require('./pageOpen.js');



module.exports = async (input, inputSecret) => {
  if (!input) { throw new Error('Input is required.'); }

  /* define x */
  const x = {
  };


  /* define lib */
  const eventEmitter = global.dex8.eventEmitter;

  const ff = new FunctionFlow({ debug: false, msDelay: 3400 }, eventEmitter);
  const echo = new Echo(true, 100, eventEmitter);

  const device_name = input.device_name || 'Desktop Windows';
  const headless = input.headless; // 'new', 'old', false -- https://developer.chrome.com/articles/new-headless/
  const sysconfig = systemConfig(device_name, headless, puppeteer);

  const lib = { input, inputSecret, puppeteer, sysconfig, echo, ff };


  /* FF injections */
  ff.xInject(x);
  ff.libInject(lib);


  /* process */
  try {
    await ff.one(browser_open);
    await ff.serial([
      pageOpen
    ]);
  } catch (err) {
    echo.error(err);
    console.log(err);
    throw err;
  } finally {
    await browser_close(x, lib);
  }


  return null;
};
