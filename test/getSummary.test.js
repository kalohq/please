const test = require('tape-catch');
const getSummary = require('../source/getSummary');

const summary = 'does awesome stuff';

test('Supports shorthand shell scripts', is => {
  const script = `#!/bin/sh -ex\n#${summary}\n`;
  is.equal(getSummary(script), summary);
  is.end();
});
