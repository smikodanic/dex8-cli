module.exports = async (x, lib) => {
  const mongofast = lib.mongofast;
  const echo = lib.echo;

  await echo.log('--- dbDisconnect ---');

  await mongofast.disconnect(); // disconnect from mongodb server

  await echo.log('Database disconnected.');

  return x;
};
