import Stream from 'stream';
import bunyan from 'bunyan';
import chalk from 'chalk';

const LEVEL_HEADERS = {
  '60': chalk.inverse.bold.red(' FATAL '),
  '50': chalk.inverse.bold.red(' ERROR '),
  '40': chalk.inverse.bold.yellow(' WARN  '),
  '30': chalk.inverse.bold.green(' INFO  '),
  '20': chalk.inverse.bold.blue(' DEBUG '),
  '10': chalk.inverse.bold.magenta(' TRACE ')
};

const LEVEL_BODIES = {
  '60': chalk.inverse.bold.red('       '),
  '50': chalk.inverse.bold.red('       '),
  '40': chalk.inverse.bold.yellow('       '),
  '30': chalk.inverse.bold.green('       '),
  '20': chalk.inverse.bold.blue('       '),
  '10': chalk.inverse.bold.magenta('       ')
};

const LOGGER_NAME = process.env.SERVICE_NAME || 'pavlov';
const PRETTY_LOGS = process.stdout.isTTY;

let logger;

if (__DEV__ && PRETTY_LOGS) {
  const exceptionFormatter = require('exception-formatter');

  // eslint-disable-next-line no-inner-declarations
  function writeHeader(obj) {
    const headerPrefix = LEVEL_HEADERS[obj.level];
    let msg = obj.msg;
    if (obj.msg === 'request finish') {
      msg = `${obj.req.method} ${obj.req.url} - ${obj.res
        .statusCode} in ${obj.duration.toFixed(3)}ms`;
    }
    process.stdout.write(`${headerPrefix} ${chalk.magenta(obj.name)} ${msg}\n`);
  }

  // eslint-disable-next-line no-inner-declarations
  function writeError(level, err) {
    const bodyPrefix = LEVEL_BODIES[level];
    const errText = exceptionFormatter(err, { format: 'ansi' });
    process.stdout.write(`${bodyPrefix}\n`);
    for (const l of errText.split('\n')) {
      process.stdout.write(`${bodyPrefix}   ${l}\n`);
    }
    process.stdout.write(`${bodyPrefix}\n`);
  }

  const stream = new Stream();
  stream.writable = true;
  stream.write = obj => {
    writeHeader(obj);
    if (obj.err) {
      writeError(obj.level, obj.err);
    }
  };

  logger = bunyan.createLogger({
    name: LOGGER_NAME,
    streams: [{ type: 'raw', stream }],
    serializers: {
      err: bunyan.stdSerializers.err,
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res
    }
  });
} else {
  logger = bunyan.createLogger({ name: LOGGER_NAME });
}

export default logger;
