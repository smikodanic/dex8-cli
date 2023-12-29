module.exports = async (x, lib) => {
  const ff = lib.ff;
  const echo = lib.echo;
  const sysconfig = lib.sysconfig;
  const proxy = lib.input.proxy;
  console.log('proxy::', proxy);

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


  // proxy authentication
  // await page.setExtraHTTPHeaders({
  //   'Proxy-Authorization': 'Basic ' + Buffer.from(`${proxy.username}:${proxy.password}`).toString('base64'),
  // });

  if (!!proxy.ip) {
    await page.authenticate({
      username: proxy.username,
      password: proxy.password,
    });
  }


  const width = sysconfig.device.viewport.width;
  const height = sysconfig.device.viewport.height;
  await page.setViewport({ width, height });

  ff.libAdd({ browser, page });

  return x;
};
