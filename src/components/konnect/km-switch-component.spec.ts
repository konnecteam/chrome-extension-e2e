import { KmSwitchComponent } from './km-switch- component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { EComponent } from '../../enum/component/component';
import { ECustomEvent } from '../../enum/events/events-custom';

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

  test('Test de getElement', () => {

    const element = document.querySelector(KM_SWITCH_SELECTOR);

    // on doit trouver le km switch
    expect(
      KmSwitchComponent.getElement(element as HTMLElement).component
    ).toEqual(EComponent.KM_SWITCH);
  });


  test('Test de editKmSwitchComponentMessage', () => {

    const element = document.querySelector(KM_SWITCH_SELECTOR);

    const eventMessage : IMessage = {
      selector : '#id'
    };

    const component : IComponent = {
      component : EComponent.KM_SWITCH,
      element : element as HTMLElement
    };

    // On doit trouver l'action click mouse
    expect(
      KmSwitchComponent.editKmSwitchComponentMessage(eventMessage, component).action
    ).toEqual(ECustomEvent.CLICK_MOUSE);
  });
});