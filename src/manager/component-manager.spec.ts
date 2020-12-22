import { DropEventComponents } from './../components/components-event/drop-event-components';
import { ComponentManager } from './component-manager';
import { ClickEventComponents } from '../components/components-event/click-event-components';
import * as path from 'path';
import domEventsToRecord from '../constants/dom-events-to-record';
import { ChangeEventComponents } from '../components/components-event/change-event-components';
import { KeydownEventComponent } from '../components/components-event/keydown-event-component';
import 'jest';
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
 * Permet de mettre à jour body
 * @param pathDoc
 */
async function changeBodyDocument(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await readFileAsync(pathFile);
  document.body.innerHTML = content;
}

describe('Test du Component Manager' , () => {

  test('Determiner component à partir d\'un click', async () => {
    // On init le bodt
    await changeBodyDocument('./../../static/test/dom/dom-filedropzone.html');

    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');

    // ON doit trouver un compoenent model de file drop zone
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.CLICK,
        element as HTMLElement,
        null,
        null,
        null
        )
    ).toEqual(
      ClickEventComponents.determinateClickComponent(
      element as HTMLElement,
      null,
      null,
      null
    ));
  });

  test('Determiner component à partir d\'un Drop', async () => {
    // On init le body
    await changeBodyDocument('./../../static/test/dom/dom-filedropzone.html');

    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');
    // ON doit trouver un compoenent model de file drop zone
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.DROP,
        element as HTMLElement,
        null,
        null,
        null
        )
    ).toEqual(
      DropEventComponents.determinateDropComponent(element as HTMLElement));
  });

  test('Determiner component à partir d\'un change', async () => {
    // On init
    await changeBodyDocument('./../../static/test/dom/dom-input-numeric.html');

    const element = document.querySelector('numeric > div > span > span > input\:nth-child(2)');
    // ON doit trouver un compoenent model d'input numeric
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.CHANGE,
        element as HTMLElement,
        null,
        null,
        null
      )
    ).toEqual(ChangeEventComponents.determinateChangeComponent(element as HTMLElement)
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
    // ON doit trouver un compoenent model d'iframe
    expect(
      ComponentManager.determinateComponent(
        domEventsToRecord.KEYDOWN,
        element,
        null,
        null,
        null
      )
    ).toEqual(KeydownEventComponent.determinateKeydownComponent(element));
  });
});