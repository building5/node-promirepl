// Copyright 2014, David M. Lee, II

/**
 * Add promise support to a repl.
 *
 * @param {REPLServer} repl The REPL to enrich with handy promise support
 */
module.exports.promirepl = (repl) => {
  const realEval = repl.eval;
  function promiseEval(cmd, context, filename, callback) {
    realEval.call(repl, cmd, context, filename, (err, res) => {
      // Error response
      if (err) {
        callback(err);
        return;
      }

      // Non-thenable response
      if (!res || typeof res.then !== 'function') {
        callback(null, res);
        return;
      }

      // Thenable detected; extract value/error from it

      let cancel;
      let hangTimer;
      let done = (doneErr, val) => {
        // ensure we call the callback only once
        // *really* shouldn't be possible, but just in case
        done = () => {};
        clearTimeout(hangTimer);
        process.stdin.removeListener('keypress', cancel);
        callback(doneErr, val);
      };

      // Start listening for escape characters, to quit waiting on the promise
      cancel = (chunk, key) => {
        if (key.name === 'escape') {
          repl.outputStream.write('break.\n');
          done(null, res);
        }
      };
      process.stdin.on('keypress', cancel);

      // Start a timer indicating that escape can be used to quit
      hangTimer = setTimeout(() => {
        repl.outputStream.write('Hit escape to stop waiting on promise\n');
      }, 5000);

      // resolve with the value/error from the promise
      res.then(val => done(null, val), resErr => done(resErr))
        .catch((uncaught) => {
          // Rethrow uncaught exceptions
          // *really* shouldn't be possible, but bugs do happen
          process.nextTick(() => {
            throw uncaught;
          });
        });
    });
  }

  repl.eval = promiseEval;

  repl.commands.promise = {
    help: 'Toggle auto-promise unwrapping',
    action() {
      if (repl.eval === promiseEval) {
        this.outputStream.write('Promise auto-eval disabled\n');
        repl.eval = realEval;
      } else {
        this.outputStream.write('Promise auto-eval enabled\n');
        repl.eval = promiseEval;
      }
      this.displayPrompt();
    },
  };
};
