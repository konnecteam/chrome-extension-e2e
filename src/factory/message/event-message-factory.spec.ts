import { IMessage } from '../../interfaces/i-message';
import { RadioGroupComponent } from '../../components/konnect/radio-group-component';
import { CheckboxComponent } from '../../components/konnect/checkbox-component';
import { IframeComponent } from '../../components/konnect/iframe-component';
import { InputNumericComponent } from '../../components/konnect/input-numeric-component';
import { EventMessageFactory } from './event-message-factory';
import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import * as path from 'path';
import 'jest';
import { KSelectComponent } from '../../components/konnect/k-select-component';
import { KListComponent } from '../../components/konnect/k-list-component';
import { FileService } from '../../services/file/file-service';

// Constant
import TAG_NAME from '../../constants/elements/tag-name';

/**
 * Permet de changer le contenu du body
 * @param pathDoc
 */
async function changeBodyDocumentAsync(pathDoc : string) {
  const PATH_DOM = path.join(__dirname, `./../../..${pathDoc}` );

  const content = await FileService.readFileAsync(PATH_DOM);
  document.body.innerHTML = content;
}

/**
 * Path des dom HTMl de chaque component
 */
const FILE_DROP_ZONE_DOM = '/static/test/dom/dom-filedropzone.html';
const INPUT_NUMERIC_DOM = '/static/test/dom/dom-input-numeric.html';
const K_SELECT_DOM = '/static/test/dom/dom-k-select.html';
const K_LIST_DOM = '/static/test/dom/dom-k-list.html';
const CHECKBOX_DOM = '/static/test/dom/dom-checkbox.html';
const RADIO_GROUP_DOM = '/static/test/dom/dom-radio-group.html';

/**
 * Selecteurs
 */
const FILE_DROP_ZONE_BUTTON_SELECTOR = 'div > div > div > span > a';
const FILE_DROP_ZONE_SELECTOR = 'div > file-dropzone > div > div > span\:nth-child(3)';
const INPUT_NUMERIC_SELECTOR = 'numeric > div > span > span > input\:nth-child(2)';
const K_SELECT_SELETOR = 'span > span > span > span\:nth-child(1) > span';
const K_ITEM_LIST_SELECTOR = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
const CHECKBOX_ID = 'ckb146';
const RADIO_GROUP_ID = 'rg168_0';


describe('Test de event message factory', () => {

  test('Test de FileDropZone component message', async () => {
    // On init le body
    await changeBodyDocumentAsync(FILE_DROP_ZONE_DOM);
    const eventCatched : IMessage = {
      files : 'text.txt'
    };
    const element = document.querySelector(FILE_DROP_ZONE_SELECTOR);
    const component = FileDropZoneComponent.getElement(element as HTMLElement);

    // On doit trouver un event model de file drop zone
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        eventCatched,
        null
      )
    ).toEqual(FileDropZoneComponent.
      editFileDropZoneComponentMessage(eventCatched, (component.element as HTMLInputElement).files));
  });

  test('Test de FileDropZone add button component message', async () => {
    // On init
    await changeBodyDocumentAsync(FILE_DROP_ZONE_DOM);

    const eventCatched : IMessage = {
      files : 'texte.txt'
    };
    // On doit trouver un event model du bouton ajouter fichier du file drop zone

    const element = document.querySelector(FILE_DROP_ZONE_BUTTON_SELECTOR);
    const component = FileDropZoneComponent.getElement(element as HTMLElement);

    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        eventCatched,
        null
      )
    ).toEqual(FileDropZoneComponent.
      editFileDropZoneButtonComponentMessage(eventCatched)
    );
  });

  test('Test de INPUT NUMERIC component message', async () => {
    // On init
    await changeBodyDocumentAsync(INPUT_NUMERIC_DOM);

    const element = document.querySelector(INPUT_NUMERIC_SELECTOR);

    const event : IMessage = {
      selector : '#id'
    };

    const component = InputNumericComponent.getElement(element as HTMLElement);

    // On doit trouver un event model d'input numeric
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        event,
        null
      )
    ).toEqual(InputNumericComponent.
      editInputNumericComponentMessage(event, component)
    );
  });

  test('Test de K select component message', async () => {
    // On init le body
    await changeBodyDocumentAsync(K_SELECT_DOM);

    const element = document.querySelector(K_SELECT_SELETOR);
    const component = KSelectComponent.getElement(element as HTMLElement);
    const event : IMessage = {
      selector: '#id'
    };
    // On doit trouver un event model de k select

    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        event,
        null
      )
    )
    .toEqual(InputNumericComponent.
      editInputNumericComponentMessage(event, component)
    );

  });

  test('Test de IFRAME component message', () => {
    // on init le body avec une iframe
    document.body.innerHTML = '';
    const iframe = document.createElement('iframe');
    const iframeContent = '<body> <h1> IFRAME </h1> </body>';
    document.body.appendChild(iframe);

    const docIframe = document.querySelector('iframe').contentWindow.document;
    docIframe.open();
    docIframe.write(iframeContent);
    docIframe.close();

    const element = document.querySelector('iframe').contentWindow.document.querySelector('h1');

    const component =  IframeComponent.getElement(element);

    const event : IMessage = {
      selector: 'selector'
    };

    // On doit trouver un event model d'iframe
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        event,
        null
      )
    )
    .toEqual(IframeComponent.
      editIframeComponentMessage(event, component)
    );


  });

  test('Test de KLIST component message', async () => {
    // On doit trouver un event model de file drop zone
    await changeBodyDocumentAsync(K_LIST_DOM);

    const element = document.querySelector(K_ITEM_LIST_SELECTOR);

    // Selector de la liste déroulante
    const previousSelector : string = TAG_NAME.KONNECT_DROPDOWNLIST;

    // infos sur l'element klist
    const previousElement  = {
      selector : previousSelector,
      typeList : 'Dropdown',
      element: document.querySelector(previousSelector)
    };

    // event model de base
    const event : IMessage = {
      selector : K_ITEM_LIST_SELECTOR
    };

    const component = KListComponent.getElement(
      element as HTMLElement,
      previousElement
    );
    // On doit trouver un event model de klist
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        event,
        null
      )
    )
    .toEqual(KListComponent.
      editKlistComponentMessage(event, component)
    );
  });

  test('Test de Checkbox component message', async () => {
    // On init le body
    await changeBodyDocumentAsync(CHECKBOX_DOM);

    const element = document.getElementById(CHECKBOX_ID);

    const component = CheckboxComponent.getElement(element);

    const event : IMessage =  {
      action : '',
    };
    // On doit trouver un event model d'input calendar
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        event,
        null
      )
    )
    .toEqual(CheckboxComponent.
      editCheckboxComponentMessage(event)
    );
  });

  test('Test de radio group component message', async () => {
    // On init le body
    await changeBodyDocumentAsync(RADIO_GROUP_DOM);

    const element = document.getElementById(RADIO_GROUP_ID);

    const component = RadioGroupComponent.getElement(element);

    const event : IMessage =  {
      action : '',
    };
    // On doit trouver un event model d'input calendar
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        event,
        null
      )
    )
    .toEqual(RadioGroupComponent.
      editRadioGroupComponentMessage(event)
    );
  });
});