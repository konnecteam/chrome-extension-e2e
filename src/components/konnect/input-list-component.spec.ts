import { InputListComponent } from './input-list-component';
import 'jest';
import * as path from 'path';
import { IComponent } from 'interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';

// Constant
import TAG_NAME from '../../constants/elements/tag-name';
import CUSTOM_EVENT from '../../constants/events/events-custom';
import COMPONENT from '../../constants/component-name';

// Path du fichier qui contient le body
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-input-list.html');

/**
 * Selecteurs
 */
const INPUT_LIST_SELECTOR = 'input';

describe('Test de input list Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement pour konnect DROPDOWN', () => {

    // On doit trouver que l'on est dans un input list
    const element = document.querySelector(TAG_NAME.INPUT);

    // On doit trouver que l'on est dans un input list
    expect(
      InputListComponent.getElement(element as HTMLElement).component
    ).toEqual(COMPONENT.INPUT_LIST);
  });

  test('Test de editInputListComponentMessage', () => {

    const eventMessage : IMessage = {
      selector : INPUT_LIST_SELECTOR
    };

    // On doit trouver l'action click mouse
    expect(
      InputListComponent.editInputListComponentMessage(eventMessage).action
    ).toEqual(CUSTOM_EVENT.CLICK_MOUSE);

  });
});