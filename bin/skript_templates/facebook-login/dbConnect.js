const Mongofast = require('@mikosoft/mongofast');

/**
 * 1) connect to the database
 * 2) define the mongoose Schema (collection)
 * 3) compile the model according to Schema
 */
module.exports = async (x, lib) => {
  const echo = lib.echo;
  const ff = lib.ff;
  const mo_uri = lib.inputSecret.mongo_uri;

  await echo.log('--- dbConnect ---');

  const mongofast = new Mongofast();
  const Schema = mongofast.Schema;
  await mongofast.connect(mo_uri);

  const opts = {};

  // compile model - "loginSessions"
  const moSchema_loginSessions = {
    fb_email: String, // fb login email
    cookies: Schema.Types.Mixed,
    localStorage: Schema.Types.Mixed,
    sessionStorage: Schema.Types.Mixed,
  };
  await mongofast.compileModel('facebook_login_sessions', moSchema_loginSessions, opts);

  await echo.log(`DB is connected and models are compiled.`);

  // add to lib
  ff.libAdd({ mongofast });

  return x;
};
