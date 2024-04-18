const FunctionFlow = require('@mikosoft/functionflow');
const Echo = require('@mikosoft/echo');
const puppeteer = require('puppeteer-core');
const systemConfig = require('./systemConfig.js');


// functions
const dbConnect = require('./dbConnect.js');
const dbDisconnect = require('./dbDisconnect.js');
const browserPage = require('./browserPage.js');
const browserClose = require('./browserClose.js');
const loginSession_load = require('./loginSession_load.js');
const loginSession_save = require('./loginSession_save.js');
const loginOpenPage = require('./loginOpenPage.js');
const login = require('./login.js');
const logout = require('./logout.js');



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
  let y = null;
  await ff.one(dbConnect); // connect to mongoDB database
  await ff.one(browserPage);
  y = await ff.serial([loginOpenPage, loginSession_load, login, loginSession_save]); // fb login
  // y = await ff.one(logout); // after logout loginSession_load will not work
  y = await ff.serial([browserClose, dbDisconnect]);


  const output = y;
  return output;
};
