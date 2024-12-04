const puppeteer = require('puppeteer-core');
const { HttpClientPptr } = require('@mikosoft/httpclient-pptr');


/**
 * Chrome Browser HTTP Client
 * 1. launch browser with URL
 * 2. extract HTML from the document
 * 3. close browser
 * 4. return the HTML
 */
module.exports = async (x, lib) => {
  const echo = lib.echo;

  const input = lib.input;
  const url = input.url;

  await echo.log('----- httpClient_pptr -----');
  await echo.log(`...opening: ${url}`);


  const opts = {
    puppeteerLaunchOptions: {
      executablePath: '/usr/bin/google-chrome',
      headless: false, // new, old, false
      devtools: false,  // open Chrome devtools
      dumpio: false, // If true, pipes the browser process stdout and stderr to process.stdout and process.stderr
      slowMo: 13,
      args: [
        '--start-maximized', // full window width and height
      ],
      ignoreDefaultArgs: [
        '--enable-automation' // remove "Chrome is being controlled by automated test software"
      ],
      defaultViewport: null, // override default viewport size {width: 800, height: 600} - https://pptr.dev/api/puppeteer.browserconnectoptions/#defaultviewport
    },
    device: null, // {name, userAgent, viewport}
    cookies: null, // [{name, value, domain, path, expires, httpOnly, secure}, ...]
    storage: null, // localStorage and sessionStorage {local: {key1: val1, key2: val2, ...}, session: {key1: val1, key2: val2, ...}}
    evaluateOnNewDocument_callback: null,
    extraRequestHeaders: {}, // additional HTTP request headers - {authorization: 'JWT ...'}
    blockResources: [], // resuources to block during the request, for example: ['image', 'stylesheet', 'font', 'script']
    gotoOpts: {}, // used in page.goto(url, opts) - {referer:string, timeout:number, waitUntil:'load'|'domcontentloaded'|'networkidle0'|'networkidle2'} - https://pptr.dev/api/puppeteer.gotooptions
    closeBrowser: true, // close browser after answer is received or on page.goto error
    waitCSSselector: null,
    postGoto: null, // function which will be executed after page.goto(), scroll, click on popup, etc. for example: postGoto: page => {page.evaluate(...);}
    debug: false
  };
  const hcp = new HttpClientPptr(opts);
  hcp.injectPuppeteer(puppeteer);
  const answer = await hcp.askOnce(url);

  if (answer) { await echo.log('URL opened and answer received.'); }

  const finalURL = answer.finalURL.replace(/\/$/, '') || url; // requested URL or URL after all redirections
  const redirected = finalURL !== url;
  const status = answer.status;
  const statusMessage = answer.statusMessage;
  const duration = answer.time.duration;
  const html = answer.res.content;
  const html_bytes = Buffer.byteLength(html, 'utf8');
  const headers = answer.res.headers; // response headers

  x.URLdata = { url, finalURL, redirected, status, statusMessage, duration, html, html_bytes, headers };
  // hcp.print(x.URLdata);

  return x;
};



