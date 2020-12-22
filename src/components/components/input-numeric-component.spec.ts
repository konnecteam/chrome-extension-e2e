import { InputNumericComponent } from './input-numeric-component';
import 'jest';
import * as path from 'path';
import { ComponentModel } from 'models/component-model';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
const fs = require('fs');

// Path pour acceder au contenu du body que l'on va utiliser
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-input-numeric.html');

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

describe('Test de Input numeric Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isInputNumeric', () => {

    // On selectionne l'input du composant input numeric qui change de valeur
    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');

    // On doit trouver qur l'on est dans une input numeric
    expect(
      InputNumericComponent.isInputNumeric(element as HTMLElement).component
    ).toEqual(componentName.INPUTNUMERIC);
  });


  test('Test de editInputFeditInputNumericMessage', () => {

    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');

    const event : EventModel = {
      selector : '#id'
    };

    // On créé un component poour pouvoir tester
    const component : ComponentModel = {

      component : 'component',
      element : element as HTMLElement
    };

    // On doit trouver que c'est un change input numeric
    expect(
      InputNumericComponent.editInputNumericMessage(event, component).action
    ).toEqual(actionEvents.CHANGE_INPUTNUMERIC);
  });
});