'use strict';

const path = require('path');
const fs = require('fs');
const tinyError = require('tiny-error');
const childProcess = require('child_process');
const permissions = require('mode-to-permissions');

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
      'Hmmm. We’ve looked everywhere, but we can’t find a scripts directory. ' +
      'Make sure your current working directory or any of its ancestors ' +
      'contains a subdirectory named `scripts`.'
    );
    return findScriptsDir(nextPath);
  }

  if (scriptsStat.isDirectory()) return scriptsPath;
  return findScriptsDir(nextPath);
}

module.exports = (args, globals) => {
  const process = globals.process;

  const cwd = process.cwd();
  const scriptsDir = findScriptsDir(cwd);

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

  const scriptPath = path.resolve(scriptsDir, script);
  const relativeScriptPath = path.join(
    path.relative(cwd, scriptsDir),
    script
  );
  let exists = true;
  let scriptStats;
  try {
    scriptStats = fs.statSync(scriptPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    exists = false;
  }
  if (!exists) throw tinyError(
    'Aw shucks! We’ve searched the whole place, but we can’t find ' +
    `the script \`${script}\`. Make sure there’s an executable file ` +
    `at \`${relativeScriptPath}\`.`
  );
  if (
    !scriptStats.isFile() ||
    !permissions(scriptStats).execute.owner
  ) throw tinyError(
    `Pssst. We can’t run the file \`${relativeScriptPath}\`, because ` +
    'it’s not an executable. You can grant it execute permissions by running ' +
    `\`chmod +x ${relativeScriptPath}\`.`
  );

  const processData = childProcess.spawnSync(
    scriptPath,
    scriptArgs,
    { stdio: 'inherit' }
  );
  process.exit(processData.status);
};
