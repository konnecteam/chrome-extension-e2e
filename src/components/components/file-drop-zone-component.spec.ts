import { FileDropZoneComponent } from './file-drop-zone-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import customEvents from '../../constants/events/events-custom';
import { FileService } from '../../services/file/file-service';

/**
 * chemin du fichier html qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-filedropzone.html');

/**
 * Selecteurs
 */
const FILE_ITEM_SELECTOR = 'fileItem';
const FILE_DROP_ZONE_BUTTON_SELECTOR = 'div > div > div > span > a';
const FILE_DROP_ZONE_SELECTOR = 'div > file-dropzone > div > div > span\:nth-child(3)';

describe('Test de File DopZone Component', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getFileDropZone pour une zone de drop', () => {

    // Selecteur de l'element de la file dropzone
    const element = document.querySelector(FILE_DROP_ZONE_SELECTOR);

    // On doit trouver la file dropzone
    expect(
      FileDropZoneComponent.getFileDropZone(element as HTMLElement).component
    ).toEqual(componentName.FILE_DROPZONE);
  });

  test('Test de getFileDropZone pour le bouton ajouter des fichiers de la zone', () => {

    // Selecteur du bouton ajouter fichier de la file dropzone
    const element = document.querySelector(FILE_DROP_ZONE_BUTTON_SELECTOR);

    // On doit trouver le bouton de la file dropzone
    expect(
      FileDropZoneComponent.getFileDropZone(element as HTMLElement).component
    ).toEqual(componentName.BUTTON_ADD_FILE_DROPZONE);

  });

  test('Test de editFileDropZoneMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      files : 'text.txt'
    };

    // On doit trouver l'action DROP_FILE
    expect(
      FileDropZoneComponent.
      editFileDropZoneMessage(eventCatched, (document.getElementById(FILE_ITEM_SELECTOR) as HTMLInputElement).files).action
    ).toEqual(customEvents.DROP_FILE);
  });

  test('Test de editFileDropZoneMessage sans files', () => {

    const eventCatched : IMessage = {
      selector : 'test',
      files : 'text.txt'
    };

    // On doit trouver l'action click sur une dropzone
    expect(
      FileDropZoneComponent.editFileDropZoneMessage(eventCatched, undefined).action
    ).toEqual(customEvents.CLICK_DROPZONE);

  });

  test('Test de editFileDropZoneButtonMessage sans files', () => {

    const eventCatched : IMessage = {
      files : 'text.txt'
    };

    // On doit trouver l'action click sur une dropzone
    expect(
      FileDropZoneComponent.editFileDropZoneButtonMessage(eventCatched).action
    ).toEqual(customEvents.CLICK_DROPZONE);
  });
});