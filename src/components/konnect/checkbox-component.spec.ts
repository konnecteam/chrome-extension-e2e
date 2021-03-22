import { CheckboxComponent } from './checkbox-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import actionEvents from '../../constants/action-events';
import { FileService } from '../../services/file/file-service';

/**
 * chemin du fichier html qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-checkbox.html');

describe('Test de Checkbox', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de getCheckboxComponent', () => {

    // Selecteur du label qui est dans la checkbox
    const element = document.getElementById('ckb146');

    // On doit trouver la Checkbox
    expect(
      CheckboxComponent.getCheckboxComponent(element).component
    ).toEqual(componentName.CHECKBOX);
  });

  test('Test de editCheckboxMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      action : 'change'
    };

    // On doit trouver l'action BASIC CLICK
    expect(
      CheckboxComponent.
      editCheckboxMessage(eventCatched).action
    ).toEqual(actionEvents.BASIC_CLICK);
  });
});