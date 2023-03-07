import { InputListComponent } from './input-list-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { ETagName } from '../../enum/elements/tag-name';
import { EComponent } from '../../enum/component/component';

import { ECustomEvent } from '../../enum/events/events-custom';

// Path du fichier qui contient le body
const PATH_DOM = path.join(__dirname, './../../test/dom/dom-input-list.html');

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
    const element = document.querySelector(ETagName.INPUT);

    // On doit trouver que l'on est dans un input list
    expect(
      InputListComponent.getElement(element).component
    ).toEqual(EComponent.INPUT_LIST);
  });

  test('Test de editInputListComponentMessage', () => {

    const eventMessage : IMessage = {
      selector : INPUT_LIST_SELECTOR
    };

    // On doit trouver l'action click mouse
    expect(
      InputListComponent.editInputListComponentMessage(eventMessage).action
    ).toEqual(ECustomEvent.CLICK_MOUSE);

  });
});