import {  RadioGroupComponent } from './radio-group-component';
import 'jest';
import * as path from 'path';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import eventsDom from '../../constants/events/events-dom';

/**
 * chemin du fichier html qui contient le body
 */
const PATH_DOM = path.join(__dirname, './../../../static/test/dom/dom-radio-group.html');

/**
 * Selecteurs
 */
const RADIO_GROUP_ID = 'rg168_0';

describe('Test de RadioGroup', () => {

  beforeAll(async() => {

    // on ajoute le contenu au body
    const content = await FileService.readFileAsync(PATH_DOM);
    document.body.innerHTML = content;
  });

  test('Test de is RadioGroupComponent', () => {

    // Selecteur du label qui est dans la RadioGroup
    const element = document.getElementById(RADIO_GROUP_ID);

    // On doit trouver la RadioGroup
    expect(
       RadioGroupComponent.getRadioGroupComponent(element).component
    ).toEqual(componentName.RADIO_GROUP);
  });

  test('Test de editRadioGroupMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      action : 'change'
    };

    // On doit trouver l'action Click
    expect(
       RadioGroupComponent.
      editRadioGroupMessage(eventCatched).action
    ).toEqual(eventsDom.CLICK);
  });
});