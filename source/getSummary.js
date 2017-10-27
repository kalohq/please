const commentPattern = {
  hash: /^\s*#(.*)$/,
  doubleSlash: /^\s*\/\/(.*)$/,
};

module.exports = script => {
  const shebangMatch = script.match(/^#! *(.+?)\n/);
  if (!shebangMatch) return null;

  const shebangParts = shebangMatch[1].split(/ +/);
  const commentFormat =
    (shebangParts[0] === '/bin/sh' && commentPattern.hash) ||
    (shebangParts[0] === '/bin/bash' && commentPattern.hash) ||
    (shebangParts[0] === '/usr/bin/env' &&
      shebangParts[1] === 'sh' &&
      commentPattern.hash) ||
    (shebangParts[0] === '/usr/bin/env' &&
      shebangParts[1] === 'bash' &&
      commentPattern.hash) ||
    (shebangParts[0] === '/usr/bin/env' &&
      shebangParts[1] === 'python' &&
      commentPattern.hash) ||
    null;
  if (!commentFormat) return null;

  const secondLine = script.split('\n')[1];
  if (typeof secondLine !== 'string') return null;

  const commentMatch = secondLine.match(commentFormat);
  if (!commentMatch || !commentMatch[1]) return null;

  return commentMatch[1].trim();
};
