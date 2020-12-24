import {  RadioGroupComponent } from './radio-group-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';
import { FileService } from '../../services/file/file-service';

/**
 * chemin du fichier html qui contient le body
 */
const pathFile = path.join(__dirname, './../../../static/test/dom/dom-radio-group.html');

describe('Test de RadioGroup', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(pathFile);
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