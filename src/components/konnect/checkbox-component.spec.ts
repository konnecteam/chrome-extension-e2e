import { CheckboxComponent } from './checkbox-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';

// Constant
import DOM_EVENT from '../../constants/events/events-dom';
import COMPONENT from '../../constants/component-name';

/**
 * chemin du fichier html qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-checkbox.html');

const CHECKBOX_ID = 'ckb146';

describe('Test de Checkbox', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement', () => {

    // Selecteur du label qui est dans la checkbox
    const element = document.getElementById(CHECKBOX_ID);

    // On doit trouver la Checkbox
    expect(
      CheckboxComponent.getElement(element).component
    ).toEqual(COMPONENT.CHECKBOX);
  });

  test('Test de editCheckboxComponentMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      action : 'change'
    };

    // On doit trouver l'action Click
    expect(
      CheckboxComponent.
      editCheckboxComponentMessage(eventCatched).action
    ).toEqual(DOM_EVENT.CLICK);
  });
});