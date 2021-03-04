import { InputNumericComponent } from './input-numeric-component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import actionEvents from '../../constants/action-events';
import { FileService } from '../../services/file/file-service';

// Path pour acceder au contenu du body que l'on va utiliser
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-input-numeric.html');

describe('Test de Input numeric Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(pathFile);
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
      InputNumericComponent.editInputNumericMessage(event, component).action
    ).toEqual(actionEvents.CHANGE_INPUTNUMERIC);
  });
});