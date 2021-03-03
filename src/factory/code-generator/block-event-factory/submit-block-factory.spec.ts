import { SubmitBlockFactory } from './submit-block-factory';
import { Block } from './../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import actionEvents from '../../../constants/action-events';
import elementsTagName from '../../../constants/elements-tagName';

/** Frame définie pour les tests */
const frameId = 0;
const frame = 'page';
describe('Test de Submit Block Factory', () => {

  // Initialisation
  beforeAll(() => {
    SubmitBlockFactory.frameId = frameId;
    SubmitBlockFactory.frame = frame;
  });

  test('Créer un submit', () => {
    const exceptedResult = new  Block(frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${frame}.keyboard.press('Enter');`
    });

    expect(
      SubmitBlockFactory.buildSubmit()
    ).toEqual(
      exceptedResult
    );
  });

  test('généré un block pour submit dans un formulaire', () => {
    const eventI = {
      tagName : elementsTagName.FORM.toUpperCase(),
      action : actionEvents.SUBMIT
    };

    expect(
      SubmitBlockFactory.generateBlock(eventI, frameId, frame, defaults )
    ).toEqual(
      SubmitBlockFactory.buildSubmit()
    );

  });
});