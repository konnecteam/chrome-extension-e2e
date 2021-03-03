import { KmSwitchComponent } from './km-switch- component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import componentName from '../../constants/component-name';
import { IEvent } from '../../interfaces/i-event';
import actionEvents from '../../constants/action-events';
import { FileService } from '../../services/file/file-service';

/**
 * Path du fichier qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-km-switch.html');

describe('Test de km switch Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de isKmSwitch', () => {

    const elementSelector = 'switch > div > span > span:nth-child(3) > span';
    const element = document.querySelector(elementSelector);

    // on doit trouver le km switch
    expect(
      KmSwitchComponent.isKmSwitch(element as HTMLElement).component
    ).toEqual(componentName.KMSWITCH);
  });


  test('Test de editKmSwitchMessage', () => {

    const elementSelector = 'switch > div > span > span:nth-child(3) > span';
    const element = document.querySelector(elementSelector);

    const eventI : IEvent = {
      selector: '#id'
    };

    const component : IComponent = {
      component : componentName.KMSWITCH,
      element : element as HTMLElement
    };

    // On doit trouver l'action click mouse
    expect(
      KmSwitchComponent.editKmSwitchMessage(eventI, component).action
    ).toEqual(actionEvents.CLICKMOUSE);
  });
});