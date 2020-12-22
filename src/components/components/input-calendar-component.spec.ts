import { InputCalendarComponent } from './input-calendar-component';
import 'jest';
import * as path from 'path';
import { ComponentModel } from 'models/component-model';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
import elementsTagName from '../../constants/elements-tagName';
const fs = require('fs');

// Path pour lire le fichier html pour le body
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-input-date.html');

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

describe('Test de input calendar Component', () => {

  beforeAll(async () => {
    // On initialise le body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test isInputCalendar pour un calendar', () => {
    // On selectionne une value du calendar
    const element = document.querySelector('[data-value="2020/10/26"]');

    // On créé le composant associé
    const component : ComponentModel =  {
      component : componentName.DATECALENDAR,
      element : element as HTMLElement
    };

    // On doit trouver le component
    expect(
      InputCalendarComponent.isInputCalendar(element as HTMLElement)
    ).toEqual(component);
  });


  test('Test isInputCalendar pour un date element', () => {

    // On selectionne l'element date
    const element = document.getElementsByTagName(elementsTagName.DATE)[0];

    const component : ComponentModel =  {
      component : componentName.DATECALENDAR,
      element : element as HTMLElement
    };

    // On doit trouver le component
    expect(
      InputCalendarComponent.isInputCalendar(element as HTMLElement)
    ).toEqual(component);
  });


  test('Test editDateMessage pour un date element', () => {
    const element = document.getElementsByTagName(elementsTagName.DATE)[0];

    const component : ComponentModel =  {
      component : componentName.DATECALENDAR,
      element : element as HTMLElement
    };

    // on créé un event model
    const event : EventModel =  {
      action : '',
    };

    // On doit trouver l'action click sur un date element
    expect(
      InputCalendarComponent.editDateMessage(event, component).action
    ).toEqual(actionEvents.CLICK_DATE_ELEMENT);
  });

  test('Test editDateMessage pour un calendar', () => {
    const element = document.querySelector('[data-value="2020/10/26"]');

    const component : ComponentModel =  {
      component : componentName.DATECALENDAR,
      element : element as HTMLElement
    };

    const event : EventModel =  {
      action : '',
    };

    // On doit trouver click sur un input date
    expect(
      InputCalendarComponent.editDateMessage(event, component).action
    ).toEqual(actionEvents.CLICK_INPUT_CALENDAR);
  });
});
