const FunctionFlow = require('functionflowx');
const Echo = require('echoer');

const f1 = require('./f1.js');


module.exports = async (input, eventEmitter) => {
  if (!input) { throw new Error('Input is required.'); }

  const ff = new FunctionFlow({ debug: false, msDelay: 800 }, eventEmitter);
  const echo = new Echo(true, 10, eventEmitter);

  const x = input.a;
  const lib = { input, echo };
  ff.xInject(x);
  ff.libInject(lib);

  const output = await ff.serial([f1]);

  echo.log('some str');

  return output;
};
