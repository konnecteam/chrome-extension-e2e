import { ClickEventComponents} from './click-event-components';
import * as path from 'path';
import { FileDropZoneComponent } from './../components/file-drop-zone-component';
import { KSelectComponent } from './../components/k-select-component';
import { KmSwitchComponent } from './../components/km-switch- component';
import { KListComponent } from '../components/k-list-component';
import { InputCalendarComponent } from '../components/input-calendar-component';
import 'jest';
import { FileService } from '../../services/file/file-service';

/**
 * Permet de changer le contenu du body
 * @param pathDoc
 */
async function changeBodyDocument(pathDoc : string) {
  const pathFile = path.join(__dirname, pathDoc );

  const content = await FileService.readFileAsync(pathFile);
  document.body.innerHTML = content;
}

describe('Test de click event component', () => {

  test('Determiner click d\'un FileDropZoneComponent', async () => {
    // on init le body
    await changeBodyDocument('./../../../static/test/dom/dom-filedropzone.html');

    const element = document.querySelector('div > file-dropzone > div > div > span\:nth-child(3)');

    // On doit trouver que l'on est dans un file drop zone
    expect(
      ClickEventComponents.determinateClickComponent(
        element as HTMLElement,
        null,
        null,
        null
      )
    ).toEqual(FileDropZoneComponent.isFileDropZone(element as HTMLElement));
  });


  test('Determiner click d\'un KSelectComponent', async () => {
    // on init le body
    await changeBodyDocument('./../../../static/test/dom/dom-k-select.html');

    const elementSelector = 'span > span > span > span\:nth-child(1) > span';
    const element = document.querySelector(elementSelector);

    // on doit trouver un component model de k selct
    expect(
      ClickEventComponents.determinateClickComponent(
        element as HTMLElement,
        null,
        null,
        null
      )
    ).toEqual(KSelectComponent.isKSelect(element as HTMLElement));

  });

  test('Determiner click d\'un KmSwitchComponent', async () => {
    // on init le body
    await changeBodyDocument('./../../../static/test/dom/dom-km-switch.html');

    const elementSelector = 'switch > div > span > span:nth-child(3) > span';
    const element = document.querySelector(elementSelector);

    // on doit trouver le component model d'un km switch
    expect(
      ClickEventComponents.determinateClickComponent(
        element as HTMLElement,
        null,
        null,
        null
      )
    ).toEqual(KmSwitchComponent.isKmSwitch(element as HTMLElement));
  });

  test('Determiner click d\'un KListComponent', async () => {
    // on init le body
    await changeBodyDocument('./../../../static/test/dom/dom-k-list.html');

    const elementSelector = 'div\:nth-child(1) > div > div > ul > li\:nth-child(2)';
    const element = document.querySelector(elementSelector);

    // Selector de la liste déroulante
    const previousSelector : string = '.k-input';

    const previousElement  = {
      selector : previousSelector,
      typeList : 'simple-list',
      element: document.querySelector('.k-input')
    };

    // On doit trouver un compoenent model qui fait référence à une k list
    expect(
      ClickEventComponents.determinateClickComponent(
        element as HTMLElement,
        elementSelector,
        previousSelector,
        previousElement
      )
    ).toEqual(KListComponent.isKlist(elementSelector, element as HTMLElement, previousSelector, previousElement));

  });

  test('Determiner click d\'un InputCalendarComponent', async () => {
    // On init le body
    await changeBodyDocument('./../../../static/test/dom/dom-input-date.html');

    const element = document.querySelector('[data-value="2020/10/26"]');

    // on dot trouver un componenet input calendar
    expect(
      ClickEventComponents.determinateClickComponent(
        element as HTMLElement,
        null,
        null,
        null
      )
    ).toEqual(InputCalendarComponent.isInputCalendar(element as HTMLElement));

  });
});