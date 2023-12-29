const FunctionFlow = require('@mikosoft/functionflow');
const Echo = require('@mikosoft/echo');

const openURL = require('./openURL');


module.exports = async (input, library) => {
  if (!input) { throw new Error('Input is required.'); }

  /* define x */
  const x = {
    URLdata: {}
  };

  /* define lib */
  const eventEmitter = library.eventEmitter;
  const ff = new FunctionFlow({ debug: false, msDelay: 1300 }, eventEmitter);
  const echo = new Echo(true, 100, eventEmitter);

  /* FF injections */
  ff.xInject(x);
  ff.libInject({ input, echo, ff });


  /* process */
  const output = await ff.one(openURL);

  return output;
};
