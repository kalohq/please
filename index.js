'use strict';

const path = require('path');
const fs = require('fs');
const tinyError = require('tiny-error');
const childProcess = require('child_process');

function findScriptsDir(currentPath) {
  const scriptsPath = path.resolve(currentPath, 'scripts');
  let scriptsStat;
  let nextPath;
  try {
    scriptsStat = fs.statSync(scriptsPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;

    nextPath = path.resolve(currentPath, '..');
    if (nextPath === currentPath) throw tinyError(
      'We’re unable to find a scripts directory. Make sure your current ' +
      'working directory or any of its ancestors has a subdirectory called ' +
      '`scripts`.'
    );
    return findScriptsDir(nextPath);
  }

  if (scriptsStat.isDirectory()) return scriptsPath;
  return findScriptsDir(nextPath);
}

module.exports = (args, globals) => {
  const process = globals.process;

  const scriptsDir = findScriptsDir(process.cwd());

  if (!args.length) {
    process.stdout.write('\nAvailable commands:\n');
    fs.readdirSync(scriptsDir).forEach(file => {
      if (file === '_') return;
      process.stdout.write(`  ${file}\n`);
    });
    process.stdout.write('\n');
    process.exit(0);
  }

  const script = args[0];
  const scriptArgs = args.slice(1);

  const processData = childProcess.spawnSync(
    path.resolve(scriptsDir, script),
    scriptArgs,
    { stdio: 'inherit' }
  );
  process.exit(processData.status);
};
