import { KSelectComponent } from './k-select-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import customEvents from '../../constants/events/events-custom';
import { FileService } from '../../services/file/file-service';

/**
 * Path du fichier qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-k-select.html');

describe('Test de k select Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de getKSelect', () => {

    // On doit trouver que l'on se trouve dans un kselect
    const elementSelector = 'span > span > span > span\:nth-child(1) > span';
    const element = document.querySelector(elementSelector);
    expect(
      KSelectComponent.getKSelect(element as HTMLElement).component
    ).toEqual(componentName.K_SELECT);
  });


  test('Test de editKSelectMessage', () => {
    const eventMessage : IMessage = {
      selector: '#id'
    };

    // on doit trouver un click sur un input numeric
    expect(
      KSelectComponent.editKSelectMessage(eventMessage).action
    ).toEqual(customEvents.CLICK_MOUSE_INPUT_NUMERIC);
  });
});