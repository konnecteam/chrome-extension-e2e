import { IframeComponent } from './../../components/components/iframe-component';
import { InputNumericComponent } from './../../components/components/input-numeric-component';
import { InputFilesComponent } from './../../components/components/input-file-component';
import { EventMessageBuilderFactory } from './event-message-builder-factory';
import { FileDropZoneComponent } from '../../components/components/file-drop-zone-component';
import { EventModel } from '../../models/event-model';
import * as path from 'path';
import 'jest';
import { KSelectComponent } from '../../components/components/k-select-component';
import componentName from '../../constants/component-name';
import { KListComponent } from '../../components/components/k-list-component';
import { InputCalendarComponent } from '../../components/components/input-calendar-component';

const fs = require('fs');

/**
 * Permet de lire un fichier
 * @param filePath
 */
function readFileAsync(filePath : string) : Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

/**
 * Permet de changer le contenu du body
 * @param pathDoc
 */
async function changeBodyDocument(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await readFileAsync(pathFile);
  document.body.innerHTML = content;
}
describe('Test de event message builder factory', () => {

  test('Test de FileDropZone component message', async () => {
    // On init le body
    await changeBodyDocument('./../../../static/test/dom/dom-filedropzone.html');
    const eventCatched : EventModel = {
      files : 'text.txt'
    };
    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');
    const component = FileDropZoneComponent.isFileDropZone(element as HTMLElement);

    // On doit trouver un event model de file drop zone
    expect(
      EventMessageBuilderFactory.buildMessageEvent(
        component,
        eventCatched,
        null
      )
    ).toEqual(FileDropZoneComponent.
      editFileDropZoneMessage(eventCatched, (component.element as HTMLInputElement).files));
  });

  test('Test de FileDropZone add button component message', async () => {
    // On init
    await changeBodyDocument('./../../../static/test/dom/dom-filedropzone.html');

    const eventCatched : EventModel = {
      files : 'texte.txt'
    };
    // On doit trouver un event model du bouton ajouter fichier du file drop zone

    const element = document.querySelector('div > div > div > span > a');
    const component = FileDropZoneComponent.isFileDropZone(element as HTMLElement);

    expect(
      EventMessageBuilderFactory.buildMessageEvent(
        component,
        eventCatched,
        null
      )
    ).toEqual(FileDropZoneComponent.
      editFileDropZoneButtonMessage(eventCatched)
    );
  });

  // On peut pas test car il faut avoir une file list
  // test('Test de INPUT FILE component message', () => {
  //   document.body.innerHTML =
  //   `<div>
  //   <input id="inFile" type="file"> </input>
  //   </div>`;

  //   const element  = document.getElementById('inFile') as HTMLInputElement;
  //   const component = InputFilesComponent.isInputFile(element);
  //   const event : EventModel = {
  //     selector : '#id'
  //   };

  //   expect(
  //     EventMessageBuilderFactory.buildMessageEvent(
  //       component,
  //       event,
  //       null
  //     )
  //   ).toEqual(InputFilesComponent.
  //     editInputFileMessage(event, (component.element as HTMLInputElement).files)
  //   );

  // });

  test('Test de INPUT NUMERIC component message', async () => {
    // On init
    await changeBodyDocument('./../../../static/test/dom/dom-input-numeric.html');

    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');

    const event : EventModel = {
      selector : '#id'
    };

    const component = InputNumericComponent.isInputNumeric(element as HTMLElement);

    // On doit trouver un event model d'input numeric
    expect(
      EventMessageBuilderFactory.buildMessageEvent(
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
    await changeBodyDocument('./../../../static/test/dom/dom-k-select.html');

    const elementSelector = 'span > span > span > span\:nth-child(1) > span';
    const element = document.querySelector(elementSelector);
    const component = KSelectComponent.isKSelect(element as HTMLElement);
    const event : EventModel = {
      selector: '#id'
    };
    // On doit trouver un event model de k select

    expect(
      EventMessageBuilderFactory.buildMessageEvent(
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

    const component =  IframeComponent.isIframe(element);

    const event : EventModel = {
      selector: 'selector'
    };

    // On doit trouver un event model d'iframe
    expect(
      EventMessageBuilderFactory.buildMessageEvent(
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
    await changeBodyDocument('./../../../static/test/dom/dom-k-list.html');

    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = '.k-input';

    // infos sur l'element klist
    const previousElement  = {
      selector : previousSelector,
      typeList : 'simple-list',
      element: document.querySelector('.k-input')
    };


    // event model de base
    const eventModel : EventModel = {
      selector : elementSelector
    };

    const component = KListComponent.isKlist(
      elementSelector,
      element as HTMLElement,
      previousSelector,
      previousElement
    );
    // On doit trouver un event model de klist
    expect(
      EventMessageBuilderFactory.buildMessageEvent(
        component,
        eventModel,
        null
      )
    )
    .toEqual(KListComponent.
      editKListMessage(eventModel, component)
    );
  });

  test('Test de DATECALENDAR component message', async () => {
    // On init le body
    await changeBodyDocument('./../../../static/test/dom/dom-input-date.html');

    const element = document.querySelector('[data-value="2020/10/26"]');

    const component = InputCalendarComponent.isInputCalendar(element as HTMLElement);

    const event : EventModel =  {
      action : '',
    };
    // On doit trouver un event model d'input calendar
    expect(
      EventMessageBuilderFactory.buildMessageEvent(
        component,
        event,
        null
      )
    )
    .toEqual(InputCalendarComponent.
      editDateMessage(event, component)
    );
  });
});