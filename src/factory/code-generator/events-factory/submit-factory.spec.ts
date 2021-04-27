import { IMessage } from '../../../interfaces/i-message';
import { SubmitFactory } from './submit-factory';
import { Block } from '../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import domEventsToRecord from '../../../constants/events/events-dom';
import customEvents from '../../../constants/events/events-custom';
import elementsTagName from '../../../constants/elements/tag-name';

/** Frame définie pour les tests */
let frameId = 0;
let frame = 'page';
describe('Test de Submit Block Factory', () => {

  // Initialisation
  beforeAll(() => {
    frameId = 0;
    frame = 'page';
  });

  test('Créer un submit', () => {
    const exceptedResult = new  Block(frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${frame}.keyboard.press('Enter');`
    });

    expect(
      SubmitFactory.buildSubmitBlock(frameId, frame)
    ).toEqual(
      exceptedResult
    );
  });

  test('généré un block pour submit dans un formulaire', () => {
    const eventMessage : IMessage = {
      tagName : elementsTagName.FORM.toUpperCase(),
      action : customEvents.SUBMIT
    };

    expect(
      SubmitFactory.generateBlock(eventMessage , frameId, frame, defaults )
    ).toEqual(
      SubmitFactory.buildSubmitBlock(frameId, frame)
    );

  });
});