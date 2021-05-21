import { ElementService } from './../services/element/element-service';
import { ComponentManager } from './component-manager';
import * as path from 'path';
import domEventsToRecord from '../constants/events/events-dom';
import 'jest';
import { FileService } from '../services/file/file-service';


/**
 * Permet de changer le contenu du body
 * @param pathDoc
 */
async function changeBodyDocumentAsync(pathDoc : string) {
  const PATH_DOM = path.join(__dirname, `./../..${pathDoc}` );

  const content = await FileService.readFileAsync(PATH_DOM);
  document.body.innerHTML = content;
}

/**
 * Chemin des fichiers sources
 */
const FILE_DROP_ZONE_DOM = '/static/test/dom/dom-filedropzone.html';
const INPUT_NUMERIC_DOM = '/static/test/dom/dom-input-numeric.html';

/**
 * Selecteurs
 */
const INPUT_NUMERIC_SELECTOR = 'numeric > div > span > span > input\:nth-child(2)';
const FILE_DROP_ZONE_SELECTOR = 'div > file-dropzone > div > div > span\:nth-child(3)';

describe('Test du Component Manager' , () => {

  test('Determiner component à partir d\'un click', async () => {
    // On init le body
    await changeBodyDocumentAsync(FILE_DROP_ZONE_DOM);

    const element = document.querySelector(FILE_DROP_ZONE_SELECTOR);

    // ON doit trouver un compoenent model de file dropzone
    expect(
      ComponentManager.getComponent(
        domEventsToRecord.CLICK,
        element as HTMLElement,
        null
        )
    ).toEqual(
      ElementService.getClickComponent(
      element as HTMLElement,
      null
    ));
  });

  test('Determiner component à partir d\'un Drop', async () => {
    // On init le body
    await changeBodyDocumentAsync(FILE_DROP_ZONE_DOM);

    const element = document.querySelector(FILE_DROP_ZONE_SELECTOR);
    // ON doit trouver un component model de file dropzone
    expect(
      ComponentManager.getComponent(
        domEventsToRecord.DROP,
        element as HTMLElement,
        null
        )
    ).toEqual(
      ElementService.getDropComponent(element as HTMLElement));
  });

  test('Determiner component à partir d\'un change', async () => {
    // On init
    await changeBodyDocumentAsync(INPUT_NUMERIC_DOM);

    const element = document.querySelector(INPUT_NUMERIC_SELECTOR);
    // ON doit trouver un component model d'input numeric
    expect(
      ComponentManager.getComponent(
        domEventsToRecord.CHANGE,
        element as HTMLElement,
        null
      )
    ).toEqual(ElementService.getChangeComponent(element as HTMLElement)
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
      ComponentManager.getComponent(
        domEventsToRecord.KEYDOWN,
        element,
        null
      )
    ).toEqual(ElementService.getKeydownComponent(element));
  });

});