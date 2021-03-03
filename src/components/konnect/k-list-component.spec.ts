import { KListComponent } from './k-list-component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import componentName from '../../constants/component-name';
import { IEvent } from '../../interfaces/i-event';
import actionEvents from '../../constants/action-events';
import { FileService } from '../../services/file/file-service';

// Path du fichier qui contient le body
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-k-list.html');
const dropdown = 'Dropdown';
const multiselect = 'Multiselect';

function isKList(elementSelector : string,
  previousSelector : string, typeList : string
  ) : void {

    // Selector de l'item d'une liste
  const element = document.querySelector(elementSelector);
  const previousElement  = {
    selector : previousSelector,
    typeList,
    element: document.querySelector(previousSelector)
  };

  // On doit trouver que l'on est dans une konnect liste
  expect(
    KListComponent.isKList(element as HTMLElement, previousElement).component
  ).toEqual(componentName.KLIST);
}

describe('Test de k list Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isKList pour konnect dropdown', () => {
    // Selector de la konnect dropdown
    const elementSelector = 'konnect-dropdownlist';
    // On doit trouver que l'on est dans une konnect liste
    isKList(elementSelector, null, null);
  });

  test('Test de isKList pour konnect multiselect', () => {

    isKList('konnect-multiselect', null, null);
  });

  test('Test de isKList pour input de list', () => {
    // Selector de l'input d'une liste
    const elementSelector = 'input[role="listbox"]';
    // On doit trouver que l'on est dans une konnect liste
    isKList(elementSelector, 'konnect-dropdownlist', dropdown);
  });

  test('Test de isKList pour un item de liste', () => {

    // Selector de l'item d'une liste
    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    // Selector de la liste déroulante
    const previousSelector : string = 'konnect-dropdownlist';
    // On doit trouver que l'on est dans une konnect liste
    isKList(elementSelector,  previousSelector, dropdown);
  });

  test('Test de editKlistMessage pour un item de k list', () => {

    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = 'konnect-dropdownlist';

    // contient les informations previous element donc de la liste
    const previousElement  = {
      selector : previousSelector,
      typeList : dropdown,
      element: document.querySelector(previousSelector)
    };

    const eventI : IEvent = {
      selector : elementSelector
    };

    // On est dans un component Dropdown liste
    const component : IComponent = {
      component : componentName.KLIST,
      element: element as HTMLElement,
      previousSelector,
      previousElement
    };

    // On doit trouver l'action click sur un item de la liste
    expect(
      KListComponent.editKlistMessage(eventI, component).action
    ).toEqual(actionEvents.CLICK_ITEMLIST);
  });

  test('Test de editKlistMessage pour un input de list', () => {

    const elementSelector = 'input[role="listbox"]';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousElement  = {
      selector : elementSelector,
      typeList : '',
      element: document.querySelector(elementSelector)
    };

    const eventI : IEvent = {
      selector : elementSelector
    };

    const component : IComponent = {
      component : componentName.KLIST,
      element: element as HTMLElement,
      previousSelector: elementSelector,
      previousElement
    };

    // On doit trouver l'action click mouse
    expect(
      KListComponent.editKlistMessage(eventI, component).action
    ).toEqual(actionEvents.CLICKMOUSE);

  });
});