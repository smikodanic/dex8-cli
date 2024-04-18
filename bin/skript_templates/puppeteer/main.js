const FunctionFlow = require('@mikosoft/functionflow');
const Echo = require('@mikosoft/echo');
const puppeteer = require('puppeteer-core');
const systemConfig = require('./systemConfig.js');


// functions
const browserPage = require('./browserPage.js');
const browserClose = require('./browserClose.js');
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


  /* FF injections */
  ff.xInject(x);
  ff.libInject({ input, inputSecret, puppeteer, sysconfig, echo, ff });


  /* process */
  await ff.one(browserPage);
  await ff.one(pageOpen);
  const output = await ff.serial([browserClose]);


  return output;
};
