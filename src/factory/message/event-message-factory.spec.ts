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

/**
 * Permet de changer le contenu du body
 * @param pathDoc
 */
async function changeBodyDocumentAsync(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await FileService.readFileAsync(pathFile);
  document.body.innerHTML = content;
}

describe('Test de event message builder factory', () => {

  test('Test de FileDropZone component message', async () => {
    // On init le body
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-filedropzone.html');
    const eventCatched : IMessage = {
      files : 'text.txt'
    };
    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');
    const component = FileDropZoneComponent.getFileDropZone(element as HTMLElement);

    // On doit trouver un event model de file drop zone
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        eventCatched,
        null
      )
    ).toEqual(FileDropZoneComponent.
      editFileDropZoneMessage(eventCatched, (component.element as HTMLInputElement).files));
  });

  test('Test de FileDropZone add button component message', async () => {
    // On init
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-filedropzone.html');

    const eventCatched : IMessage = {
      files : 'texte.txt'
    };
    // On doit trouver un event model du bouton ajouter fichier du file drop zone

    const element = document.querySelector('div > div > div > span > a');
    const component = FileDropZoneComponent.getFileDropZone(element as HTMLElement);

    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        eventCatched,
        null
      )
    ).toEqual(FileDropZoneComponent.
      editFileDropZoneButtonMessage(eventCatched)
    );
  });

  test('Test de INPUT NUMERIC component message', async () => {
    // On init
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-input-numeric.html');

    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');

    const event : IMessage = {
      selector : '#id'
    };

    const component = InputNumericComponent.getInputNumeric(element as HTMLElement);

    // On doit trouver un event model d'input numeric
    expect(
      EventMessageFactory.buildMessageEvent(
        component,
        event,
        null
      )
    ).toEqual(InputNumericComponent.
      editInputNumericMessage(event, component)
    );
  });

  test('Test de K select component message', async () => {
    // On init le body
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-k-select.html');

    const elementSelector = 'span > span > span > span\:nth-child(1) > span';
    const element = document.querySelector(elementSelector);
    const component = KSelectComponent.getKSelect(element as HTMLElement);
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
      editInputNumericMessage(event, component)
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

    const component =  IframeComponent.getIframe(element);

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
      editIframeMessage(event, component)
    );


  });

  test('Test de KLIST component message', async () => {
    // On doit trouver un event model de file drop zone
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-k-list.html');

    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = 'konnect-dropdownlist';

    // infos sur l'element klist
    const previousElement  = {
      selector : previousSelector,
      typeList : 'Dropdown',
      element: document.querySelector(previousSelector)
    };

    // event model de base
    const event : IMessage = {
      selector : elementSelector
    };

    const component = KListComponent.getKList(
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
      editKlistMessage(event, component)
    );
  });

  test('Test de Checkbox component message', async () => {
    // On init le body
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-checkbox.html');

    const element = document.getElementById('ckb146');

    const component = CheckboxComponent.getCheckboxComponent(element);

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
      editCheckboxMessage(event)
    );
  });

  test('Test de radio group component message', async () => {
    // On init le body
    await changeBodyDocumentAsync('./../../../static/test/dom/dom-radio-group.html');

    const element = document.getElementById('rg168_0');

    const component = RadioGroupComponent.getRadioGroupComponent(element);

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
      editRadioGroupMessage(event)
    );
  });
});