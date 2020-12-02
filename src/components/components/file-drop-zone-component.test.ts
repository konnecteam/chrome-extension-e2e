import { FileDropZoneComponent } from './file-drop-zone-component';
import 'jest';
import * as path from 'path';
import { ComponentModel } from 'models/component-model';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
const fs = require('fs');

/**
 * chemin du fichier html qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-filedropzone.html');

/**
 * Permet de lire un fichier
 *
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

describe('Test de File DopZone Component', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isFileDropZone pour une zone de drop', () => {

    // Selecteur de l'element de la file drop zone
    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');

    // On doit trouver la file drop zone
    expect(
      FileDropZoneComponent.isFileDropZone(element as HTMLElement).component
    ).toEqual(componentName.FILEDROPZONE);
  });

  test('Test de isFileDropZone pourle bouton ajouter des fichiers de la zone', () => {

    // Selecteur du bouton ajouter fichier de la file drop zone
    const element = document.querySelector('div > div > div > span > a');

    // On doit trouver le bouton de la file drop zone
    expect(
      FileDropZoneComponent.isFileDropZone(element as HTMLElement).component
    ).toEqual(componentName.FILEDROPZONEADD);

  });

  test('Test de editFileDropZoneMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : EventModel = {
      files : 'text.txt'
    };

    // On doit trouver l'action Drop_Dropzone
    expect(
      FileDropZoneComponent.
      editFileDropZoneMessage(eventCatched, (document.getElementById('fileItem') as HTMLInputElement).files).action
    ).toEqual(actionEvents.DROP_DROPZONE);
  });

  test('Test de editFileDropZoneMessage sans files', () => {

    const eventCatched : EventModel = {
      selector : 'test',
      files : 'text.txt'
    };

    // On doit trouver l'action click sur une drop zone
    expect(
      FileDropZoneComponent.editFileDropZoneMessage(eventCatched, undefined).action
    ).toEqual(actionEvents.CLICK_DROPZONE);

  });

  test('Test de editFileDropZoneButtonMessage sans files', () => {

    const eventCatched : EventModel = {
      files : 'text.txt'
    };

    // On doit trouver l'action click sur une drop zone
    expect(
      FileDropZoneComponent.editFileDropZoneButtonMessage(eventCatched).action
    ).toEqual(actionEvents.CLICK_DROPZONE);
  });
});