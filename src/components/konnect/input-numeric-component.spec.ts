import { InputNumericComponent } from './input-numeric-component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { EComponentName } from '../../enum/component/component-name';
import { ECustomEvent } from '../../enum/events/events-custom';

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
    ).toEqual(EComponentName.INPUT_NUMERIC);
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
    ).toEqual(ECustomEvent.CHANGE_INPUT_NUMERIC);
  });
});