import { PopoverComponent } from './popover-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { EComponent } from '../../enum/component/component';
import { ECustomEvent } from '../../enum/events/events-custom';

// Path du fichier qui contient le body
const PATH_DOM = path.join(__dirname, './../../test/dom/dom-popover.html');

/**
 * Selecteur
 */
const POPOVER_SELECTOR = '.konnect-popover-content-margin-neg';

describe('Test de Popover Component', () => {

  beforeAll(async() => {

    // On init le body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de getElement pour Popover', () => {

    const element = document.querySelector(POPOVER_SELECTOR);

    // On doit trouver que l'on est dans un popover
    expect(
      PopoverComponent.getElement(element as HTMLElement).component
    ).toEqual(EComponent.POPOVER);
  });

  test('Test de editPopoverComponentMessage', () => {

    const eventMessage : IMessage = {
      selector : POPOVER_SELECTOR
    };

    // On doit trouver l'action click mouse enter
    expect(
      PopoverComponent.editPopoverComponentMessage(eventMessage).action
    ).toEqual(ECustomEvent.CLICK_MOUSE_ENTER);

  });
});