import { InputNumericComponent } from './input-numeric-component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import customEvents from '../../constants/events/events-custom';
import { FileService } from '../../services/file/file-service';

// Path pour acceder au contenu du body que l'on va utiliser
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-input-numeric.html');

/**
 * Selecteurs
 */
const INPUT_NUMERIC_SELECTOR = 'numeric > div > span > span > input\:nth-child(2)';

describe('Test de Input numeric Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement', () => {

    // On selectionne l'input du composant input numeric qui change de valeur
    const element = document.querySelector(INPUT_NUMERIC_SELECTOR);

    // On doit trouver qur l'on est dans une input numeric
    expect(
      InputNumericComponent.getElement(element as HTMLElement).component
    ).toEqual(componentName.INPUT_NUMERIC);
  });


  test('Test de editInputNumericComponentMessage', () => {

    const element = document.querySelector(INPUT_NUMERIC_SELECTOR);

    const event : IMessage = {
      selector : '#id'
    };

    // On créé un component pour pouvoir tester
    const component : IComponent = {

      component : 'component',
      element : element as HTMLElement
    };

    // On doit trouver que c'est un change input numeric
    expect(
      InputNumericComponent.editInputNumericComponentMessage(event, component).action
    ).toEqual(customEvents.CHANGE_INPUT_NUMERIC);
  });
});