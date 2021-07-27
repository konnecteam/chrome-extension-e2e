import {  RadioGroupComponent } from './radio-group-component';
import 'jest';
import * as path from 'path';
import { IMessage } from '../../interfaces/i-message';
import { FileService } from '../../services/file/file-service';
import { EComponent } from '../../enum/component/component';
import { EDomEvent } from '../../enum/events/events-dom';

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

  test('Test de getElement', () => {

    // Selecteur du label qui est dans la RadioGroup
    const element = document.getElementById(RADIO_GROUP_ID);

    // On doit trouver la RadioGroup
    expect(
       RadioGroupComponent.getElement(element).component
    ).toEqual(EComponent.RADIO_GROUP);
  });

  test('Test de editRadioGroupComponentMessage', () => {
    // On créé un event model qui contient les infos dont on a besoin
    const eventCatched : IMessage = {
      action : 'change'
    };

    // On doit trouver l'action Click
    expect(
       RadioGroupComponent.
      editRadioGroupComponentMessage(eventCatched).action
    ).toEqual(EDomEvent.CLICK);
  });
});