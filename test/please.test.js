const tape = require('tape-catch');
const mockFs = require('mock-fs');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const path = require('path');
const packageInfo = require('../package.json');
const naked = require('strip-ansi');

const test = (description, callback) => {
  tape(description, is => {
    mockFs.restore();
    callback(is);
  });
};
Object.assign(test, tape);

const executableConfig = {mode: 0o555};
const executable = mockFs.file(executableConfig);

const newProcess = spread =>
  Object.assign(
    {
      cwd: () => '/',
      stdout: {},
      stdin: {},
    },
    spread
  );

test('Displays nice `--help`', is => {
  const status = 5;
  const spawnSync = sinon.stub().returns({status});
  const process = newProcess();

  const please = proxyquire('../source/please', {
    child_process: {spawnSync},
  });

  const exitCode = please(['--help'], {process});

  is.equal(spawnSync.callCount, 1, 'spawns…');

  const command = spawnSync.lastCall.args[0];
  const args = spawnSync.lastCall.args[1];
  const config = spawnSync.lastCall.args[2];
  is.equal(command, 'man', '…`man`');

  is.equal(
    args[0],
    path.resolve(__dirname, '../manpages/please.1'),
    'with the right manpage'
  );

  is.equal(config.stdio[0], process.stdout, 'writes to `stdout`');

  is.equal(config.stdio[1], process.stdin, 'reads from `stdin`');

  is.equal(exitCode, 0, 'succeeds');
  is.end();
});

test('Falls back to plain text `--help` over stdout', is => {
  const expectedHelpContent = 'I’m dreaming of a white Christmas';
  const hasbin = {sync: sinon.stub().returns(false)};
  const fs = {readFileSync: sinon.stub().returns(expectedHelpContent)};
  const stdout = {write: sinon.spy()};

  const please = proxyquire('../source/please', {
    hasbin,
    fs,
  });

  const exitCode = please(['--help'], {process: newProcess({stdout})});

  is.equal(
    hasbin.sync.calledOnce && hasbin.sync.lastCall.args[0],
    'man',
    'checks if `man` is in the PATH'
  );

  const expectedLocation = '../manpages/please.1.txt';
  is.deepEqual(
    fs.readFileSync.calledOnce && fs.readFileSync.lastCall.args,
    [path.resolve(__dirname, expectedLocation), 'utf8'],
    `reads the file at \`${expectedLocation}\``
  );

  is.equal(
    stdout.write.calledOnce && stdout.write.lastCall.args[0],
    expectedHelpContent,
    'prints the help text'
  );

  is.equal(exitCode, 0, 'succeeds');
  is.end();
});

test('Prints the `--version` and exits', is => {
  const stdout = {write: sinon.spy()};
  const please = require('../source/please'); // eslint-disable-line global-require
  const exitCode = please(['--version'], {process: newProcess({stdout})});

  is.equal(
    stdout.write.calledOnce && stdout.write.lastCall.args[0],
    `please v${packageInfo.version}\n`,
    'prints the version'
  );

  is.equal(exitCode, 0, 'succeeds');
  is.end();
});

test('Runs an executable from a `scripts` directory in the CWD', is => {
  const script = 'my-script';
  const args = ['one two', 'three'];
  const status = 5;

  const spawnSync = sinon.stub().returns({status});

  const please = proxyquire('../source/please', {
    child_process: {spawnSync},
  });

  mockFs({
    '/scripts': {
      [script]: executable,
    },
  });

  const spawnSyncCallCount = spawnSync.callCount;
  const exitCode = please([script].concat(args), {process: newProcess()});

  is.equal(
    spawnSync.callCount,
    spawnSyncCallCount + 1,
    'uses `child_process.spawnSync`'
  );
  is.equal(
    spawnSync.lastCall.args[0],
    `/scripts/${script}`,
    'to call the right script'
  );
  is.deepEqual(spawnSync.lastCall.args[1], args, 'with the right arguments');
  is.deepEqual(
    spawnSync.lastCall.args[2],
    {stdio: 'inherit'},
    'printing to stdout/stderr and reading from stdin'
  );

  is.equal(exitCode, status, 'exits with the same status as the script');

  is.end();
});

test('Throws an informative error if it can’t find a scripts directory', is => {
  is.plan(2);

  const process = newProcess();
  const please = proxyquire('../source/please', {});

  mockFs({
    '/someting-else': {},
  });

  try {
    please(['my-script', 'whatever'], {process});
  } catch (error) {
    is.ok(
      /can’t find a scripts directory/i.test(error.message),
      'tells me what’s wrong'
    );
    is.ok(/make sure/i.test(error.message), 'tells me what to do');
  }

  is.end();
});

test('Throws an informative error if it can’t find the script', is => {
  is.plan(2);

  const process = newProcess();
  const please = proxyquire('../source/please', {});

  mockFs({
    '/scripts': {},
  });

  try {
    please(['my-script', 'whatever'], {process});
  } catch (error) {
    is.ok(
      /can’t find the script `my-script`/i.test(error.message),
      'tells me what’s wrong'
    );
    is.ok(/make sure/i.test(error.message), 'tells me what to do');
  }

  is.end();
});

test(
  'Throws an informative error if the script is not an executable file ' +
    'or symlink',
  is => {
    is.plan(2);

    const process = newProcess();
    const please = proxyquire('../source/please', {});

    mockFs({
      '/scripts': {
        'my-script': '(plain text)',
      },
    });

    try {
      please(['my-script', 'whatever'], {process});
    } catch (error) {
      is.ok(
        /can’t run the file `scripts\/my-script`/i.test(error.message),
        'tells me what’s wrong'
      );
      is.ok(/you can/i.test(error.message), 'tells me what to do');
    }

    is.end();
  }
);

test('Looks for executables recursively, crawling up the directory tree', is => {
  const script = 'my-script';
  const status = 5;

  const spawnSync = sinon.stub().returns({status});
  const cwd = '/current-working-dir';
  const process = newProcess({
    cwd: () => cwd,
  });

  const please = proxyquire('../source/please', {
    child_process: {spawnSync},
  });

  mockFs({
    '/scripts': {
      [script]: executable,
    },
    [cwd]: {
      scripts: {
        'other-script': executable,
      },
    },
  });

  please([script], {process});

  is.equal(
    !!spawnSync.calledOnce && spawnSync.lastCall.args[0],
    `/scripts/${script}`,
    'calls the right script'
  );

  is.end();
});

test('Prints a list of found executables when called without arguments', is => {
  const scriptOne = 'script-one';
  const scriptTwo = 'script-two';
  const status = 5;

  const spawnSync = sinon.stub().returns({status});
  const cwd = '/current-working-dir';
  const stdout = {
    write: sinon.spy(),
  };

  const process = newProcess({
    cwd: () => cwd,
    stdout,
  });

  const please = proxyquire('../source/please', {
    child_process: {spawnSync},
  });

  mockFs({
    '/scripts': {
      [scriptTwo]: executable,
      directory: {},
    },
    [cwd]: {
      scripts: {
        [scriptOne]: executable,
        'plain-text-file': '(plain text)',
      },
    },
  });

  const {callCount} = stdout.write;
  please([], {process});

  is.equal(stdout.write.callCount, callCount + 1, 'prints to stdout');
  is.equal(
    naked(stdout.write.lastCall.args[0]),
    '💡  Run `please --help` for more info.\n' +
      '\n' +
      '\n' +
      'available scripts\n' +
      '\n' +
      `${scriptOne}\n` +
      `${scriptTwo}\n`,
    'prints the right stuff'
  );

  is.end();
});

const executableWithDocs = ({shebang, docs}) =>
  mockFs.file({
    ...executableConfig,
    content: `${shebang}\n${docs}\n`,
  });

test('Prints one-liner summaries using the first comment under the shebang', is => {
  const scriptOneDocs = 'run a JS script';
  const scriptTwoDocs = 'quick & handy `rm -rf /` shortcut';
  const bashScriptWithoutDocs = 'script-three';
  const status = 5;
  const spawnSync = sinon.stub().returns({status});
  const cwd = '/current-working-dir';
  const stdout = {write: sinon.spy()};
  const process = newProcess({cwd: () => cwd, stdout});
  const please = proxyquire('../source/please', {child_process: {spawnSync}});

  mockFs({
    '/scripts': {
      'script-one': executableWithDocs({
        shebang: '#! /usr/bin/env node',
        docs: `// ${scriptOneDocs}`,
      }),
      'script-two-longer-name': executableWithDocs({
        shebang: '#!/bin/bash -ex',
        docs: `#   ${scriptTwoDocs}  `,
      }),
      [bashScriptWithoutDocs]: executableWithDocs({
        shebang: '#!/bin/bash -ex',
        docs: '',
      }),
    },
  });

  const exitCode = please([], {process});
  is.true(stdout.write.calledOnce, 'prints to stdout');
  is.equal(
    naked(stdout.write.lastCall.args[0]),
    '💡  Run `please --help` for more info.\n' +
      '\n' +
      '\n' +
      'available scripts\n' +
      '\n' +
      `script-one              ${scriptOneDocs}\n` +
      `script-three\n` +
      `script-two-longer-name  ${scriptTwoDocs}\n`,
    'prints the right stuff'
  );
  is.equal(exitCode, 0, 'succeeds');

  is.end();
});
