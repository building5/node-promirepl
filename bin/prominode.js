#!/usr/bin/env node
// Copyright 2014-2019, David M. Lee, II

const repl = require('repl');

const { promirepl } = require('..');

const replServer = repl.start({});
promirepl(replServer);

// share history with Node's repl
// available in Node.js 11.10.0 and later
if (typeof replServer.setupHistory === 'function') {
  replServer.setupHistory(process.env.NODE_REPL_HISTORY, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
