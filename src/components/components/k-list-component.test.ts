import { KListComponent } from './k-list-component';
import 'jest';
import * as path from 'path';
import { ComponentModel } from 'models/component-model';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
const fs = require('fs');
// Path du fichier qui contient le body
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-k-list.html');

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

describe('Test de k list Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isInputNumeric pour une simple k list', () => {

    // item d'une liste simple
    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = '.k-input';

    const previousElement  = {
      selector : previousSelector,
      typeList : 'simple-list',
      element: document.querySelector('.k-input')
    };

    // On doit trouver que l'on est dans une klist
    expect(
      KListComponent.isKlist(elementSelector, element as HTMLElement, previousSelector, previousElement).component
    ).toEqual(componentName.KLIST);

  });

  test('Test de isInputNumeric pour une multiple list', () => {

    // Selecteur d'un item d'une multiple k list
    const elementSelector = 'div > div > ul > li\:nth-child(4) > span';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = '[aria-describedby]';

    const previousElement  = {
      selector : previousSelector,
      typeList : 'mutiple-list',
      element: document.querySelector(previousSelector)
    };

    // On doit trouver que c'est une k list
    expect(
      KListComponent.isKlist(elementSelector, element as HTMLElement, previousSelector, previousElement).component
    ).toEqual(componentName.KLIST);

  });

  test('Test de isInputNumeric pour une input de list', () => {


    // selecteur de l'input de la liste
    const elementSelector = 'input[role="listbox"]';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousElement  = {
      selector : elementSelector,
      typeList : '',
      element: document.querySelector(elementSelector)
    };

    // On doit trouver qu'on est sur une klist
    expect(
      KListComponent.isKlist(elementSelector, element as HTMLElement, '', previousElement).component
    ).toEqual(componentName.KLIST);

  });

  test('Test de editKListMessage pour une simple k list', () => {

    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = '.k-input';

    // contient les informations previous element donc de la klist
    const previousElement  = {
      selector : previousSelector,
      typeList : 'simple-list',
      element: document.querySelector('.k-input')
    };

    const eventModel : EventModel = {
      selector : elementSelector
    };

    const component : ComponentModel = {
      component : componentName.KLIST,
      element: element as HTMLElement,
      previousSelector,
      previousElement
    };

    // On doit trouver l'action click sur une simple liste
    expect(
      KListComponent.editKListMessage(eventModel, component).action
    ).toEqual(actionEvents.CLICK_SIMPLELIST);
  });

  test('Test de editKListMessage pour une multiple list', () => {

    const elementSelector = 'div > div > ul > li\:nth-child(4) > span';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = '[aria-describedby]';

    const previousElement  = {
      selector : previousSelector,
      typeList : 'multiple-list',
      element: document.querySelector(previousSelector)
    };

    const eventModel : EventModel = {
      selector : elementSelector
    };

    const component : ComponentModel = {
      component : componentName.KLIST,
      element: element as HTMLElement,
      previousSelector,
      previousElement
    };

    // On doit trouver click sur une multiple liste
    expect(
      KListComponent.editKListMessage(eventModel, component).action
    ).toEqual(actionEvents.CLICK_MULTIPLELIST);

  });

  test('Test de editKListMessage pour une input de list', () => {

    const elementSelector = 'input[role="listbox"]';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante

    const previousElement  = {
      selector : elementSelector,
      typeList : '',
      element: document.querySelector(elementSelector)
    };

    const eventModel : EventModel = {
      selector : elementSelector
    };

    const component : ComponentModel = {
      component : componentName.KLIST,
      element: element as HTMLElement,
      previousSelector: elementSelector,
      previousElement
    };

    // On doit trouver cl'action lick mouse
    expect(
      KListComponent.editKListMessage(eventModel, component).action
    ).toEqual(actionEvents.CLICKMOUSE);

  });
});