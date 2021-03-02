import { KmSwitchComponent } from './km-switch- component';
import 'jest';
import * as path from 'path';
import { ComponentModel } from 'models/component-model';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
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