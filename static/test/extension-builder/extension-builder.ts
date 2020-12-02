import { file } from 'jszip';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
import * as path from 'path';

// Path du fichier qui contient le body
const pathJson = path.join(__dirname, './../../../package.json');

/**
 * Permet de lire un fichier
 * @param filePath
 */
function readFileAsync(filePath : string) : Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

let scripts : { dist : string, build : any};
readFileAsync(pathJson).then(fileContent => {
  scripts = JSON.parse(fileContent).scripts;
});

export const runDist = function () {
  return exec(scripts.dist);
};

export const runBuild = function () {
  return exec(scripts.build);
};
