const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

export const runDist = function () {
  return exec('npm run dist');
};

export const runBuild = function () {
  return exec('npm run build');
};
