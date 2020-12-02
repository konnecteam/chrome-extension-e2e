import { KSelectComponent } from './k-select-component';
import 'jest';
import * as path from 'path';
import { ComponentModel } from 'models/component-model';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
const fs = require('fs');

/**
 * Path du fichier qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-k-select.html');

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


describe('Test de k select Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isKSelect', () => {

    // On doit trouver que l'on se trouve dans un kselect
    const elementSelector = 'span > span > span > span\:nth-child(1) > span';
    const element = document.querySelector(elementSelector);
    expect(
      KSelectComponent.isKSelect(element as HTMLElement).component
    ).toEqual(componentName.KSELECT);
  });


  test('Test de editKSelectMessage', () => {

    const eventModel : EventModel = {
      selector: '#id'
    };

    // on doit trouver un click sur un input numeric
    expect(
      KSelectComponent.editKSelectMessage(eventModel).action
    ).toEqual(actionEvents.CLICKMOUSE_INPUTNUMERIC);
  });
});