import { IMessage } from '../../../interfaces/i-message';
import { SubmitFactory } from './submit-factory';
import { Block } from '../../../code-generator/block';
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
    SubmitFactory.frameId = frameId;
    SubmitFactory.frame = frame;
  });

  test('Créer un submit', () => {
    const exceptedResult = new  Block(frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${frame}.keyboard.press('Enter');`
    });

    expect(
      SubmitFactory.buildSubmitBlock()
    ).toEqual(
      exceptedResult
    );
  });

  test('généré un block pour submit dans un formulaire', () => {
    const eventMessage : IMessage = {
      tagName : elementsTagName.FORM.toUpperCase(),
      action : actionEvents.SUBMIT
    };

    expect(
      SubmitFactory.generateBlock(eventMessage , frameId, frame, defaults )
    ).toEqual(
      SubmitFactory.buildSubmitBlock()
    );

  });
});