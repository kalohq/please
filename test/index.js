/* eslint-disable quote-props */
  // mock-fs file trees and proxyquire overrides look better when quoted
require('tap-spec-integrated');

const test = require('tape-catch');
const mock = require('mock-fs');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

test('Runs an executable from a `scripts` directory in the CWD', (is) => {
  const script = 'my-script';
  const args = ['one two', 'three'];
  const status = 5;

  const spawnSync = sinon.stub().returns({ status });
  const process = {
    cwd: () => '/',
    exit: sinon.spy(),
  };

  const please = proxyquire('..', {
    'child_process': { spawnSync },
  });

  mock({
    '/scripts': {
      [script]: mock.file({
        mode: parseInt('111', 8),
      }),
    },
  });

  const callCount = spawnSync.callCount;
  please([script].concat(args), { process });

  is.equal(
    spawnSync.callCount,
    callCount + 1,
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

  is.end();

  mock.restore();
});

test.skip('Throws an informative error if it can’t find the script');

test.skip('Looks for executables recursively, crawling up the directory tree');

test.skip('Prints a list of found executables when called without arguments');
