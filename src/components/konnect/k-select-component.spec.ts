import { KSelectComponent } from './k-select-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { EComponent } from '../../enum/component/component';
import { ECustomEvent } from '../../enum/events/events-custom';

/**
 * Path du fichier qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../test/dom/dom-k-select.html');

/**
 * Selecteurs
 */
const K_SELECT_SELETOR = 'span > span > span > span\:nth-child(1) > span';

describe('Test de k select Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement', () => {

    // On doit trouver que l'on se trouve dans un kselect
    const element = document.querySelector(K_SELECT_SELETOR);
    expect(
      KSelectComponent.getElement(element as HTMLElement).component
    ).toEqual(EComponent.K_SELECT);
  });


  test('Test de editKSelectComponentMessage', () => {
    const eventMessage : IMessage = {
      selector : '#id'
    };

    // on doit trouver un click sur un input numeric
    expect(
      KSelectComponent.editKSelectComponentMessage(eventMessage).action
    ).toEqual(ECustomEvent.CLICK_MOUSE_INPUT_NUMERIC);
  });
});