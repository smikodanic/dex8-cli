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

  try {
    const opts = {
      headless: false, // 'new' 'old' false
      windowPosition: [700, 20],
      timeout: 21000,
      referer: '',
      block: ['image'],
      scroll: false,
      waitUntil: 'load', // load, networkidle, networkidle2
      argsAppend: [
        // '--disable-dev-shm-usage',
        // '--use-gl=egl',
        // '--disable-setuid-sandbox',
        // '--no-first-run',
        // '--no-zygote',
        // '--single-process',
        // '--disable-gpu',
        // '--no-sandbox',
        // required for iframe
        // '--disable-web-security',
        // '--disable-features=IsolateOrigins,site-per-process',
      ],
      extraHeaders: {},
      closeBrowser: true,
      closePopups: [
        // "button#gdpr-banner-accept"
      ],
      debug: false
    };
    const hcp = new HttpClientPptr(opts);
    hcp.injectPuppeteer(puppeteer);
    hcp.defineExecutablePath(); // '/usr/bin/google-chrome'
    hcp.setDeviceObject('Desktop Windows');

    const answer = await hcp.ask(url);

    if (answer) { echo.log('URL opened and answer received.'); }

    const url_after_redirect = answer.redirectedURL.replace(/\/$/, '') || url;
    const status = answer.status;
    const statusMessage = answer.statusMessage;
    const redirected = url_after_redirect && url_after_redirect !== url;
    const duration = answer.time.duration;
    const html = answer.res.content;
    const html_bytes = Buffer.byteLength(html, 'utf8');
    const headers = answer.res.headers; // response headers

    x.URLdata = { url, url_after_redirect, status, statusMessage, redirected, duration, html, html_bytes, headers };
    // hcp.print(x.URLdata);

  } catch (err) {
    echo.error(err);
  }

  return x;
};



