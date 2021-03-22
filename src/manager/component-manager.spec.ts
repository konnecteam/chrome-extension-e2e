import { ElementService } from './../services/element/element-service';
import { ComponentManager } from './component-manager';
import * as path from 'path';
import domEventsToRecord from '../constants/events/events-dom';
import 'jest';
import { FileService } from '../services/file/file-service';


/**
 * Permet de mettre à jour body
 * @param pathDoc
 */
async function changeBodyDocumentAsync(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await FileService.readFileAsync(pathFile);
  document.body.innerHTML = content;
}

describe('Test du Component Manager' , () => {

  test('Determiner component à partir d\'un click', async () => {
    // On init le body
    await changeBodyDocumentAsync('./../../static/test/dom/dom-filedropzone.html');

    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');

    // ON doit trouver un compoenent model de file dropzone
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.CLICK,
        element as HTMLElement,
        null
        )
    ).toEqual(
      ElementService.determinateClickComponent(
      element as HTMLElement,
      null
    ));
  });

  test('Determiner component à partir d\'un Drop', async () => {
    // On init le body
    await changeBodyDocumentAsync('./../../static/test/dom/dom-filedropzone.html');

    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');
    // ON doit trouver un component model de file dropzone
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.DROP,
        element as HTMLElement,
        null
        )
    ).toEqual(
      ElementService.determinateDropComponent(element as HTMLElement));
  });

  test('Determiner component à partir d\'un change', async () => {
    // On init
    await changeBodyDocumentAsync('./../../static/test/dom/dom-input-numeric.html');

    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');
    // ON doit trouver un component model d'input numeric
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.CHANGE,
        element as HTMLElement,
        null
      )
    ).toEqual(ElementService.determinateChangeComponent(element as HTMLElement)
    );
  });

  test('Determiner component à partir d\'un keydown', () => {
    // Ajout d'une iframe
    document.body.innerHTML = '';
    const iframe = document.createElement('iframe');
    const iframeContent = '<body> <h1> IFRAME </h1> </body>';
    document.body.appendChild(iframe);

    const docIframe = document.querySelector('iframe').contentWindow.document;
    docIframe.open();
    docIframe.write(iframeContent);
    docIframe.close();

    const element = document.querySelector('iframe').contentWindow.document.querySelector('h1');
    // ON doit trouver un component model d'iframe
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.KEYDOWN,
        element,
        null
      )
    ).toEqual(ElementService.determinateKeydownComponent(element));
  });

});