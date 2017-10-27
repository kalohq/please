const test = require('tape-catch');
const getSummary = require('../source/getSummary');

const summary = 'does awesome stuff';

test('Supports shorthand sh scripts', is => {
  const script = `#!/bin/sh -ex\n#${summary}\n`;
  is.equal(getSummary(script), summary);
  is.end();
});

test('Supports shorthand bash scripts', is => {
  const script = `#!/bin/bash -ex\n#${summary}\n`;
  is.equal(getSummary(script), summary);
  is.end();
});

test('Supports sh scripts', is => {
  const script = `#! /usr/bin/env sh\n# ${summary}\n`;
  is.equal(getSummary(script), summary);
  is.end();
});

test('Supports bash scripts', is => {
  const script = `#! /usr/bin/env bash\n# ${summary}\n`;
  is.equal(getSummary(script), summary);
  is.end();
});
