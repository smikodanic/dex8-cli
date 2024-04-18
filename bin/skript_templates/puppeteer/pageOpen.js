module.exports = async (x, lib) => {
  const echo = lib.echo;
  const page = lib.page;
  const input = lib.input;
  const url = input.url;

  echo.log('----- pageOpen -----');

  echo.log(` ...opening page "${url}"`);
  await page.goto(url, { referer: '' });

  return x;
};
