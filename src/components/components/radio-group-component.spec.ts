import {  RadioGroupComponent } from './radio-group-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
const fs = require('fs');

/**
 * chemin du fichier html qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-radio-group.html');

/**
 * Permet de lire un fichier
 *
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

describe('Test de RadioGroup', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await readFileAsync(pathFile);
    document.body.innerHTML = content;
  });

  test('Test de is RadioGroupComponent', () => {

    // Selecteur du label qui est dans la RadioGroup
    const element = document.getElementById('rg168_0');

    // On doit trouver la RadioGroup
    expect(
       RadioGroupComponent.isRadioGroupComponent(element).component
    ).toEqual(componentName.RADIOGROUP);
  });

  test('Test de editRadioGroupMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : EventModel = {
      action : 'change'
    };

    // On doit trouver l'action BASIC CLICK
    expect(
       RadioGroupComponent.
      editRadioGroupMessage(eventCatched).action
    ).toEqual(actionEvents.BASIC_CLICK);
  });
});