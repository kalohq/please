const path = require('path');
const fs = require('fs');
const tinyError = require('tiny-error');
const childProcess = require('child_process');
const permissions = require('mode-to-permissions');
const hasbin = require('hasbin');

const fileInfo = filePath => {
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return {exists: false, executable: false};
  }

  if (!stats.isFile() || !permissions(stats).execute.owner)
    return {exists: true, executable: false};

  return {exists: true, executable: true};
};

function findScriptsDirs(directories, currentPath) {
  const scriptsPath = path.resolve(currentPath, 'scripts');
  let scriptsStat;
  const nextPath = path.resolve(currentPath, '..');
  try {
    scriptsStat = fs.statSync(scriptsPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    if (nextPath === currentPath) return directories;
    return findScriptsDirs(directories, nextPath);
  }

  const nextDirectories = scriptsStat.isDirectory()
    ? directories.concat([scriptsPath])
    : directories;
  if (nextPath === currentPath) return nextDirectories;
  return findScriptsDirs(nextDirectories, nextPath);
}

/**
 * Takes raw CLI `args` and a global `process`. Returns the exit code.
 */
module.exports = (args, globals) => {
  const {process} = globals;

  if (args[0] === '--help') {
    if (hasbin.sync('man')) {
      childProcess.spawnSync(
        'man',
        [path.resolve(__dirname, '../manpages/please.1')],
        {stdio: [process.stdout, process.stdin]}
      );
    } else {
      const fallbackPath = path.resolve(__dirname, '../manpages/please.1.txt');
      const plainTextHelp = fs.readFileSync(fallbackPath, 'utf8');
      process.stdout.write(plainTextHelp);
    }
    return 0;
  }

  const cwd = process.cwd();
  const scriptsDirs = findScriptsDirs([], cwd);
  if (!scriptsDirs.length)
    throw tinyError(
      'Hmmm. We’ve looked everywhere, but we can’t find a scripts directory. ' +
        'Make sure your current working directory or any of its ancestors ' +
        'contains a subdirectory named `scripts`.'
    );

  if (!args.length) {
    const allScripts = scriptsDirs.map(dir =>
      fs
        .readdirSync(dir)
        .filter(file => fileInfo(path.join(dir, file)).executable)
    );
    const allScriptsFlat = Array.prototype.concat.apply([], allScripts);

    /* eslint-disable prefer-template */
    // So how do you propose to format this, ESLint?
    process.stdout.write(
      '\n' +
        'Available commands:\n' +
        allScriptsFlat.map(script => `  ${script}\n`).join('') +
        '\n'
    );
    /* eslint-enable prefer-template */
    return 0;
  }

  const [script, ...scriptArgs] = args;
  const relativeScriptPath = dir => path.join(path.relative(cwd, dir), script);
  const scriptsPathData = scriptsDirs.map(dir => ({
    dir,
    file: path.resolve(dir, script),
  }));
  const scriptPathData = scriptsPathData.find(data => {
    const file = fileInfo(data.file);
    if (!file.exists) return false;
    if (!file.executable)
      throw tinyError(
        `Pssst. We can’t run the file \`${relativeScriptPath(
          data.dir
        )}\`, because ` +
          'it’s not an executable. You can grant it execute permissions ' +
          `by running \`chmod +x ${relativeScriptPath(data.dir)}\`.`
      );
    return true;
  });

  if (scriptPathData === undefined)
    throw tinyError(
      'Aw shucks! We’ve searched the whole place, but we can’t find ' +
        `the script \`${script}\`. Make sure there’s an executable file ` +
        `at \`${relativeScriptPath(scriptsDirs[0])}\`.`
    );

  const processData = childProcess.spawnSync(scriptPathData.file, scriptArgs, {
    stdio: 'inherit',
  });
  return processData.status;
};
