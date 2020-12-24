import 'jest';
import * as path from 'path';
import { ZipService } from './zip-service';
import * as fs from 'fs';
import JSZip = require('jszip');
import { FileService } from '../../services/file/file-service';

let zipService : ZipService;

const fileTestFile = path.join(__dirname, './../../../static/test/file/test.txt');

// tslint:disable: no-identical-functions

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

  beforeAll(function(done) {
    zipService = ZipService.Instance;
    done();
  });

  afterAll(async () => {
    const zipPath = path.join(__dirname, './../../../static/test/file/test.zip');
    const fileExist = await isFileExist(zipPath);

    if (fileExist) {
      await deleteFile(zipPath);
    }
  });

  test('Test ajouter un fichier dans le zip', async () => {

    const filePath = 'test/test.txt';
    const fileContent = await FileService.readFileAsync(fileTestFile);

    const zipServiceResult = zipService.addFileInFolder(filePath, fileContent);

    const zipValue = new JSZip();
    const zipResult = zipValue.file(filePath, fileContent);

    expect(
      zipServiceResult.file(filePath).name
    ).toEqual(
      zipResult.file(filePath).name
    );
  });

  test('Test générer le fichier zip', async () => {

    // Récupération du fichier de test
    const filePath = 'test/test.txt';
    const fileContent = await FileService.readFileAsync(fileTestFile);

    // Création du zip (buffer)
    zipService.addFileInFolder(filePath, fileContent);
    const zip = await zipService.generateAsync();

    // Création du zip sur le disque
    const zipPath = path.join(__dirname, './../../../static/test/file/test.zip');
    await createFileAsync(zipPath, zip);

    const fileExist = await isFileExist(zipPath);
    expect(fileExist).toBeTruthy();
  });
});