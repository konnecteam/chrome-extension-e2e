import { IComponent } from './../../interfaces/i-component';
import { KimoceDocumentsComponent } from './kimoce-documents-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';

// Constant
import COMPONENT from '../../constants/component-name';
import CUTOM_EVENT from '../../constants/events/events-custom';

/**
 * chemin du fichier html qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-kimoce-documents.html');

const KIMOCE_DOCUMENTS_ADD_BUTTTON = 'A[title="Ajouter un document"]';

describe('Test de Kimoce Documents Component', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement pour le bouton ajouter des fichiers', () => {

    // Selecteur du bouton ajouter fichier
    const element = document.querySelector(KIMOCE_DOCUMENTS_ADD_BUTTTON);

    // On doit trouver le bouton
    expect(
      KimoceDocumentsComponent.getElement(element as HTMLElement).component
    ).toEqual(COMPONENT.KIMOCE_DOCUMENTS_ADD_BUTTON);

  });


  test('Test de edit component message pour le bouton ajouter des fichiers', () => {

    const element : HTMLElement = document.querySelector(KIMOCE_DOCUMENTS_ADD_BUTTTON);

    const eventCatched : IMessage = {
      files : 'text.txt'
    };

    const component : IComponent = {
      component : COMPONENT.KIMOCE_DOCUMENTS_ADD_BUTTON,
      element
    };
    // On doit trouver l'action click sur une dropzone
    expect(
      KimoceDocumentsComponent.editKimoceDocumentsComponentMessage(eventCatched, component).action
    ).toEqual(CUTOM_EVENT.CLICK_DROPZONE);
  });

});