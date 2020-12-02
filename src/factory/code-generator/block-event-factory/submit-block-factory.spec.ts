import { SubmitBlockFactory } from './submit-block-factory';
import { Block } from './../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'mocha';
import * as assert from 'assert';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import actionEvents from '../../../constants/action-events';
import elementsTagName from '../../../constants/elements-tagName';

/** Frame définie pour les tests */
const frameId = 0;
const frame = 'page';
describe('Test de Submit Block Factory', () => {

  before('Initialisation', () => {
    SubmitBlockFactory.frameId = frameId;
    SubmitBlockFactory.frame = frame;
  });

  it('Créer un submit', () => {
    const exceptedResult = new  Block(frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${frame}.keyboard.press('Enter');`
    });


    assert.deepStrictEqual(SubmitBlockFactory.buildSubmit(), exceptedResult);
  });

  it('généré un block pour submit dans un formulaire', () => {
    const eventModel = {
      tagName : elementsTagName.FORM.toLocaleUpperCase(),
      action : actionEvents.SUBMIT
    };
    assert.deepStrictEqual(SubmitBlockFactory.generateBlock(eventModel, frameId, frame, defaults ), SubmitBlockFactory.buildSubmit());
  });
});