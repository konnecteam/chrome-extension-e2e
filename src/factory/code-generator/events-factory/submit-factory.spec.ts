import { ClickFactory } from './click-factory';
import { IOption } from '../../../interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { SubmitFactory } from './submit-factory';
import { Block } from '../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import customEvents from '../../../constants/events/events-custom';
import elementsTagName from '../../../constants/elements/tag-name';

/** Frame définie pour les tests */
let frameId = 0;
let frame = 'page';
let options : IOption;
let selector : string;

describe('Test de Submit Block Factory', () => {

  // Initialisation
  beforeAll(() => {
    frameId = 0;
    frame = 'page';
    options =  JSON.parse(JSON.stringify(defaults));
    selector = 'button';
  });

  test('Créer un submit', () => {
    const exceptedResult = ClickFactory.buildBlock(options, frameId, frame, selector);

    expect(
      SubmitFactory.buildBlock(frameId, frame, options, selector)
    ).toEqual(
      exceptedResult
    );
  });

  test('généré un block pour submit dans un formulaire', () => {
    const eventMessage : IMessage = {
      tagName : elementsTagName.FORM.toUpperCase(),
      action : customEvents.SUBMIT,
      submitterSelector : selector
    };

    expect(
      SubmitFactory.generateBlock(eventMessage , frameId, frame, options )
    ).toEqual(
      SubmitFactory.buildBlock(frameId, frame, options, selector)
    );

  });
});