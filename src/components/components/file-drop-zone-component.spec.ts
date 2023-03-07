import { FileDropZoneComponent } from './file-drop-zone-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { EComponent } from '../../enum/component/component';
import { ECustomEvent } from '../../enum/events/events-custom';

/**
 * chemin du fichier html qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../test/dom/dom-filedropzone.html');

/**
 * Selecteurs
 */
const FILE_ITEM_SELECTOR = 'fileItem';
const FILE_DROP_ZONE_SELECTOR = 'div > file-dropzone > div > div > span\:nth-child(3)';

describe('Test de File DopZone Component', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement pour une zone de drop', () => {

    // Selecteur de l'element de la file dropzone
    const element = document.querySelector(FILE_DROP_ZONE_SELECTOR);

    // On doit trouver le file dropzone
    expect(
      FileDropZoneComponent.getElement(element as HTMLElement).component
    ).toEqual(EComponent.FILE_DROPZONE);
  });

  test('Test de editFileDropZoneComponentMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      files : 'text.txt'
    };

    // On doit trouver l'action DROP_FILE
    expect(
      FileDropZoneComponent.
      editFileDropZoneComponentMessage(eventCatched, (document.getElementById(FILE_ITEM_SELECTOR) as HTMLInputElement).files).action
    ).toEqual(ECustomEvent.DROP_FILE);
  });

});