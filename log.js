const cli = require('cli-color');

var log = {
  main: function (output) {
    console.log(cli.cyan(output));
  },
  notify: function (output) {
    console.log(cli.magenta(output));
  },
  begin: function (output) {
    return process.stdout.write(cli.blackBright(output));
  },
  ok: function finish(output) {
    return console.log(cli.white(output || 'ok.'));
  },
  completed: function (output) {
    console.log(cli.green(output || 'completed.'));
  },
  error: function (output) {
    console.log(cli.red(output || 'error.'));
  }
};

module.exports = log;