import 'mocha';
import * as assert from 'assert';
import * as path from 'path';
import { ZipService } from './zip-service';
import * as fs from 'fs';
import JSZip = require('jszip');

let zipService : ZipService;

const fileTestFile = path.join(__dirname, './../../../static/test/file/test.txt');

// tslint:disable: no-identical-functions
/** Lecture du contenu du fichier */
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

/** Création d'un fichier sur le disque */
function createFileAsync(filePath : string, content : Buffer) : Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, {}, err => {
      if (err) {
        return reject(err);
      } else {
        return resolve(true);
      }
    });
  });
}

/** Vérification de l'éxistence des fichiers */
function isFileExist(filePath : string) : Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, exists => {
      return resolve(exists);
    });
  });
}

/** Suppression d'un fichier sur le disque */
function deleteFile(filePath : string) : Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {

      if (err) {
        return reject(err);
      } else {
        return resolve(true);
      }
    });
  });
}

describe('Test de Zip service', () => {

  before(function(done) {
    zipService = ZipService.Instance;
    done();
  });

  after(async () => {
    const zipPath = path.join(__dirname, './../../../static/test/file/test.zip');
    const fileExist = await isFileExist(zipPath);

    if (fileExist) {
      await deleteFile(zipPath);
    }
  });

  it('Test ajouter un fichier dans le zip', async () => {

    const filePath = 'test/test.txt';
    const fileContent = await readFileAsync(fileTestFile);

    const zipServiceResult = zipService.addFileInFolder(filePath, fileContent);

    const zipValue = new JSZip();
    const zipResult = zipValue.file(filePath, fileContent);
    assert.strictEqual(zipServiceResult.file(filePath).name, zipResult.file(filePath).name);
  });

  it('Test générer le fichier zip', async () => {

    // Récupération du fichier de test
    const filePath = 'test/test.txt';
    const fileContent = await readFileAsync(fileTestFile);

    // Création du zip (buffer)
    zipService.addFileInFolder(filePath, fileContent);
    const zip = await zipService.generateAsync();

    // Création du zip sur le disque
    const zipPath = path.join(__dirname, './../../../static/test/file/test.zip');
    await createFileAsync(zipPath, zip);

    const fileExist = await isFileExist(zipPath);
    assert.strictEqual(fileExist, true);
  });
});