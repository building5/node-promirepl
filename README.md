# promirepl

A promise infused REPL.

Promirepl provides a Node.js REPL which will automagically unwrap [promise][]
values. It also is Node module, with a function that can add these magical
promise inspecting capabilities to your own custom REPLs.

This allows you to use promise based APIs from the REPL just as easily as old
fashioned synchronous APIs, without a lot of messing around with callbacks and
`console.log` to get at asynchronous values from the REPL.

## Installation

Promirepl can be installed with `npm install -g promirepl`. This installs the
`prominode` executable, which starts a Node.js REPL that has magical promise
unwraping capabilities.

## Usage

    $ prominode

Whenever a value evaluates to a promise (well, technically a [thenable][]),
promirepl will wait for the promise to resolve.

    > Promise.resolve('hello')
    'hello'

    > new Promise((resolve) => {
    ... setTimeout(() => { resolve('some time later'); }, 3000);
    ... })
    'some time later'

If the promise is rejected, it will evaluate as a thrown error.

    > Promise.reject(new Error('boom'))
    Error: boom
        at repl:1:16
        at REPLServer.defaultEval (repl.js:135:27)

If you would like to stop waiting on a promise, hit escape.

    > new Promise(function () {})
    Hit escape to stop waiting on promise
    break.

If you would like to disable promise unwrapping, enter the `.promise` command.

    > .promise
    Promise auto-eval disabled

    > Promise.resolve('hello')
    {}

    > Promise.reject(new Error('boom'))
    {}

## Programmatic Usage

If you would like to use promirepl within your own custom REPL, use the
exported `promirepl` function.

    const customRepl = createCustomRepl();
    const { promirepl } = require('promirepl');
    promirepl(customRepl.start({}));

 [promise]: https://promisesaplus.com/
 [thenable]: https://promisesaplus.com/#point-7
