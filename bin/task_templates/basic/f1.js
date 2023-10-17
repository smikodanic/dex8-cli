module.exports = async (x, lib) => {
  const input = lib.input;
  const echo = lib.echo;

  echo.log('f1::', x, input.username);
  x.n++;

  return x;
};
