import { FileDropZoneComponent } from './file-drop-zone-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { IEvent } from '../../interfaces/i-event';
import actionEvents from '../../constants/action-events';
import { FileService } from '../../services/file/file-service';

/**
 * chemin du fichier html qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-filedropzone.html');

describe('Test de File DopZone Component', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isFileDropZone pour une zone de drop', () => {

    // Selecteur de l'element de la file dropzone
    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');

    // On doit trouver la file dropzone
    expect(
      FileDropZoneComponent.isFileDropZone(element as HTMLElement).component
    ).toEqual(componentName.FILEDROPZONE);
  });

  test('Test de isFileDropZone pour le bouton ajouter des fichiers de la zone', () => {

    // Selecteur du bouton ajouter fichier de la file drop zone
    const element = document.querySelector('div > div > div > span > a');

    // On doit trouver le bouton de la file dropzone
    expect(
      FileDropZoneComponent.isFileDropZone(element as HTMLElement).component
    ).toEqual(componentName.FILEDROPZONEADD);

  });

  test('Test de editFileDropZoneMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IEvent = {
      files : 'text.txt'
    };

    // On doit trouver l'action Drop_Dropzone
    expect(
      FileDropZoneComponent.
      editFileDropZoneMessage(eventCatched, (document.getElementById('fileItem') as HTMLInputElement).files).action
    ).toEqual(actionEvents.DROP_DROPZONE);
  });

  test('Test de editFileDropZoneMessage sans files', () => {

    const eventCatched : IEvent = {
      selector : 'test',
      files : 'text.txt'
    };

    // On doit trouver l'action click sur une dropzone
    expect(
      FileDropZoneComponent.editFileDropZoneMessage(eventCatched, undefined).action
    ).toEqual(actionEvents.CLICK_DROPZONE);

  });

  test('Test de editFileDropZoneButtonMessage sans files', () => {

    const eventCatched : IEvent = {
      files : 'text.txt'
    };

    // On doit trouver l'action click sur une dropzone
    expect(
      FileDropZoneComponent.editFileDropZoneButtonMessage(eventCatched).action
    ).toEqual(actionEvents.CLICK_DROPZONE);
  });
});