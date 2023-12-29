const FunctionFlow = require('@mikosoft/functionflow');
const Echo = require('@mikosoft/echo');


// skript files
const f1 = require('./f1.js');



module.exports = async (input, library) => {
  if (!input) { throw new Error('Input is required.'); }

  /* define x */
  const x = {
    n: input.a
  };

  /* define lib */
  const eventEmitter = library.eventEmitter;
  eventEmitter.setMaxListeners(5); // 10 by default
  const ff = new FunctionFlow({ debug: false, msDelay: 1300 }, eventEmitter);
  const echo = new Echo(true, 100, eventEmitter);

  /* FF injections */
  ff.xInject(x);
  ff.libInject({ input, echo, ff });

  /* process */
  const output = await ff.serialRepeat([f1], 3);

  echo.objekt(output);

  return output;
};
