import { FileDropZoneComponent } from './../components/file-drop-zone-component';
import { DropEventComponents} from './drop-event-components';
import * as path from 'path';
import 'jest';
const fs = require('fs');

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

/**
 * Met à jour le body
 * @param pathDoc
 */
async function changeBodyDocument(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await readFileAsync(pathFile);
  document.body.innerHTML = content;
}

describe('Test de drop event component', () => {

  test('Determiner drop d\'un FileDropZoneComponent', async () => {
    // on inti le body
    await changeBodyDocument('./../../../static/test/dom/dom-filedropzone.html');

    // On doit trouver un component file drop zine
    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');
    expect(
      DropEventComponents.determinateDropComponent(element as HTMLElement)
    ).toEqual(FileDropZoneComponent.isFileDropZone(element as HTMLElement));
  });
});