import { KmSwitchComponent } from './km-switch- component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import customEvents from '../../constants/events/events-custom';
import { FileService } from '../../services/file/file-service';

/**
 * Path du fichier qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-km-switch.html');

/**
 * Selecteurs
 */
const KM_SWITCH_SELECTOR = 'switch > div > span > span:nth-child(3) > span';

describe('Test de km switch Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getKmSwitch', () => {

    const element = document.querySelector(KM_SWITCH_SELECTOR);

    // on doit trouver le km switch
    expect(
      KmSwitchComponent.getKmSwitch(element as HTMLElement).component
    ).toEqual(componentName.KM_SWITCH);
  });


  test('Test de editKmSwitchMessage', () => {

    const element = document.querySelector(KM_SWITCH_SELECTOR);

    const eventMessage : IMessage = {
      selector: '#id'
    };

    const component : IComponent = {
      component : componentName.KM_SWITCH,
      element : element as HTMLElement
    };

    // On doit trouver l'action click mouse
    expect(
      KmSwitchComponent.editKmSwitchMessage(eventMessage, component).action
    ).toEqual(customEvents.CLICK_MOUSE);
  });
});