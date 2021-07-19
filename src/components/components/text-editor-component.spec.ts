import { TextEditorComponent } from './text-editor-component';
import 'jest';
import * as path from 'path';
import { FileService } from '../../services/file/file-service';
import { EComponentName } from '../../enum/component/component-name';
import { IMessage } from '../../interfaces/i-message';
import { EDomEvent } from '../../enum/events/events-dom';

/**
 * Chemin du fichier html qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-text-editor.html');
const TEXT_EDITOR_SELECTOR = 'text-editor > div > div > div > div > p';

describe('Test de Text editor Component', () => {

  beforeAll(async() => {
    // On ajoute le contenu au body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement', () => {

    // Text editor content
    const element : HTMLElement = document.querySelector(TEXT_EDITOR_SELECTOR);

    // On doit trouver le text editor
    expect(
      TextEditorComponent.getElement(element).component
    ).toEqual(EComponentName.TEXT_EDITOR);
  });

  test('Test de editTextEditorComponentMessage', () => {

    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      action : 'click'
    };

    // Text editor content
    const element : HTMLElement = document.querySelector(TEXT_EDITOR_SELECTOR);

    // On doit trouver l'action Keydown
    expect(
      TextEditorComponent.
      editTextEditorComponentMessage(eventCatched, TextEditorComponent.getElement(element)).action
    ).toEqual(EDomEvent.KEYDOWN);
  });
});