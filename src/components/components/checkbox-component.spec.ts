import { CheckboxComponent } from './checkbox-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
const fs = require('fs');

/**
 * chemin du fichier html qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-checkbox.html');

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

describe('Test de Checkbox', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isCheckboxComponent', () => {

    // Selecteur du label qui est dans la checkbox
    const element = document.getElementById('ckb146');

    // On doit trouver la Checkbox
    expect(
      CheckboxComponent.isCheckboxComponent(element).component
    ).toEqual(componentName.CHECKBOX);
  });

  test('Test de editCheckboxMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : EventModel = {
      action : 'change'
    };

    // On doit trouver l'action BASIC CLICK
    expect(
      CheckboxComponent.
      editCheckboxMessage(eventCatched).action
    ).toEqual(actionEvents.BASIC_CLICK);
  });
});