/* eslint-disable quote-props */
  // mock-fs file trees and proxyquire overrides look better when quoted
require('tap-spec-integrated');

const test = require('tape-catch');
const mockFs = require('mock-fs');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const executable = mockFs.file({
  mode: parseInt('111', 8),
});

const newProcess = (splat) => Object.assign({
  cwd: () => '/',
  exit: () => {},
}, splat);

test((
  'Runs an executable from a `scripts` directory in the CWD'
), (is) => {
  const script = 'my-script';
  const args = ['one two', 'three'];
  const status = 5;

  const spawnSync = sinon.stub().returns({ status });
  const exit = sinon.spy();
  const process = newProcess({ exit });

  const please = proxyquire('..', {
    'child_process': { spawnSync },
  });

  mockFs({
    '/scripts': {
      [script]: executable,
    },
  });

  const spawnSyncCallCount = spawnSync.callCount;
  const exitCallCount = exit.callCount;
  please([script].concat(args), { process });

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
  is.deepEqual(
    spawnSync.lastCall.args[1],
    args,
    'with the right arguments'
  );
  is.deepEqual(
    spawnSync.lastCall.args[2],
    { stdio: 'inherit' },
    'printing to stdout/stderr and reading from stdin'
  );

  is.equal(
    exit.callCount,
    exitCallCount + 1,
    'exits the parent process'
  );
  is.deepEqual(
    exit.lastCall.args,
    [status],
    'with the same exit code as the script’s'
  );

  mockFs.restore();
  is.end();
});

test.skip('Throws an informative error if it can’t find the script');

test.skip('Looks for executables recursively, crawling up the directory tree');

test.skip('Prints a list of found executables when called without arguments');
