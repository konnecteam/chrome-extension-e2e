import 'mocha';
import * as assert from 'assert';
import { FileFactory } from './file-facory';
import * as atob from 'atob';
import * as path from 'path';
import * as fs from 'fs';

const fileTestFile = path.join(__dirname, './../../../static/test/file/test.txt');
const fileTestWrite = path.join(__dirname, './../../../static/test/file/test_write.txt');
const mimeType = 'text/plain;';
let dataURL : string;
let contentFile : string;

// tslint:disable: no-identical-functions
/** Lecture du contenu du fichier */
function readFileAsync(filePath : string) : Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'base64', (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

/** Création d'un fichier sur le disque */
function createFileAsync(filePath : string, content : Uint8Array) : Promise<boolean> {
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

describe('Test de File factory', () => {

  before('Définition de atob et d\'un data url', async() => {

    // Définition de atob
    global.atob = atob;

    contentFile = await readFileAsync(fileTestFile);
    // Création d'un data url
    dataURL = `data:${mimeType}base64,${contentFile}`;

  });

  after(async () => {
    const fileExist = await isFileExist(fileTestWrite);

    if (fileExist) {
      await deleteFile(fileTestWrite);
    }
  });

  it('Test de build d\'un data url', async () => {

    const result = FileFactory.buildFileObject(dataURL);

    // On créer le fichier avec le résultat obtenu
    await createFileAsync(fileTestWrite, result.u8arr);

    // On verifie si le fichier existe
    const fileExist = await isFileExist(fileTestWrite);
    let contentOfWriteFile = '';

    /*
     Si il existe on va le lire et
     le comparer avec le contenu du fichier de base
     si ils ont le même contenu alors c'est correct
    */
    if (fileExist) {
      contentOfWriteFile = await readFileAsync(fileTestWrite);
    }

    assert.strictEqual(contentOfWriteFile, contentFile);
  });
});