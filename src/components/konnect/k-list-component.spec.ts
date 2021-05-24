import { KListComponent } from './k-list-component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import customEvents from '../../constants/events/events-custom';
import { FileService } from '../../services/file/file-service';
import elementsTagName from '../../constants/elements/tag-name';

// Path du fichier qui contient le body
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-k-list.html');

/**
 * Types de liste
 */
const DROPDOWN = 'Dropdown';
const MULTISELECT = 'Multiselect';

/**
 * Selecteurs
 */
const INPUT_LIST_SELECTOR = 'input[role="listbox"]';
const ITEM_LIST_SELECTOR = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';

/**
 * Permet de tester si c'est une klist
 * @param elementSelector
 * @param previousSelector
 * @param typeList
 */
function testKList(elementSelector : string,
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
    KListComponent.getElement(element as HTMLElement, previousElement).component
  ).toEqual(componentName.KLIST);
}

describe('Test de k list Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement pour konnect DROPDOWN', () => {

    // On doit trouver que l'on est dans une konnect liste
    testKList(elementsTagName.KONNECT_DROPDOWNLIST, null, null);
  });

  test('Test de getElement pour konnect multiselect', () => {
    // On doit trouver que l'on est dans une konnect liste
    testKList(elementsTagName.KONNECT_MULTISELECT, null, null);
  });

  test('Test de getElement pour input de liste', () => {
    // On doit trouver que l'on est dans un input de liste
    testKList(INPUT_LIST_SELECTOR, elementsTagName.KONNECT_DROPDOWNLIST, DROPDOWN);
  });

  test('Test de getElement pour un item de liste', () => {

    // On doit trouver que l'on est dans une konnect liste
    testKList(ITEM_LIST_SELECTOR,  elementsTagName.KONNECT_DROPDOWNLIST, DROPDOWN);
  });

  test('Test de editKlistComponentMessage pour un item de konnect liste', () => {

    const element = document.querySelector(ITEM_LIST_SELECTOR);

    // Selector de la liste déroulante
    const previousSelector : string = elementsTagName.KONNECT_DROPDOWNLIST;

    // contient les informations previous element donc de la liste
    const previousElement = {
      selector : previousSelector,
      typeList : DROPDOWN,
      element: document.querySelector(previousSelector)
    };

    const eventMessage : IMessage = {
      selector : ITEM_LIST_SELECTOR
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
      KListComponent.editKlistComponentMessage(eventMessage, component).action
    ).toEqual(customEvents.CLICK_LIST_ITEM);
  });

  test('Test de editKlistComponentMessage pour un input de list', () => {

    const element = document.querySelector(INPUT_LIST_SELECTOR);

    // Selector de la liste déroulante
    const previousElement  = {
      selector : INPUT_LIST_SELECTOR,
      typeList : '',
      element: document.querySelector(INPUT_LIST_SELECTOR)
    };

    const eventMessage : IMessage = {
      selector : INPUT_LIST_SELECTOR
    };

    const component : IComponent = {
      component : componentName.KLIST,
      element: element as HTMLElement,
      previousSelector: INPUT_LIST_SELECTOR,
      previousElement
    };

    // On doit trouver l'action click mouse
    expect(
      KListComponent.editKlistComponentMessage(eventMessage, component).action
    ).toEqual(customEvents.CLICK_MOUSE);

  });
});