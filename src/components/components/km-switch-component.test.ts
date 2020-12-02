import { KmSwitchComponent } from './km-switch- component';
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
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-km-switch.html');

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


describe('Test de km switch Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isKmSwitch', () => {

    const elementSelector = 'switch > div > span > span:nth-child(3) > span';
    const element = document.querySelector(elementSelector);

    // on doit trouver le kmswitch
    expect(
      KmSwitchComponent.isKmSwitch(element as HTMLElement).component
    ).toEqual(componentName.KMSWITCH);
  });


  test('Test de editKmSwitchMessage', () => {

    const elementSelector = 'switch > div > span > span:nth-child(3) > span';
    const element = document.querySelector(elementSelector);

    const eventModel : EventModel = {
      selector: '#id'
    };

    const component : ComponentModel = {
      component : componentName.KMSWITCH,
      element : element as HTMLElement
    };

    // On doit trouver l'action click mouse
    expect(
      KmSwitchComponent.editKmSwitchMessage(eventModel, component).action
    ).toEqual(actionEvents.CLICKMOUSE);
  });
});