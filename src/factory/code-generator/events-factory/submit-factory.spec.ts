import { ClickFactory } from './click-factory';
import { IOption } from '../../../interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { SubmitFactory } from './submit-factory';
import { Block } from '../../../code-generator/block';
import 'jest';
import customEvents from '../../../constants/events/events-custom';
import elementsTagName from '../../../constants/elements/tag-name';

/** Frame définie pour les tests */
let frameId = 0;
let frame = 'page';

/**
 * Options
 */
const optionsDefault = {
  wrapAsync: true,
  headless: false,
  waitForNavigation: true,
  waitForSelectorOnClick: true,
  blankLinesBetweenBlocks: true,
  dataAttribute: '',
  useRegexForDataAttribute: false,
  customLineAfterClick: '',
  recordHttpRequest: true,
  regexHTTPrequest: '',
  customLinesBeforeEvent: `await page.evaluate(async() => {
    await konnect.engineStateService.Instance.waitForAsync(1);
  });`,
  deleteSiteData: true,
};

/**
 * Selecteur d'un element
 */
let selector : string;
describe('Test de Submit Block Factory', () => {

  // Initialisation
  beforeAll(() => {
    frameId = 0;
    frame = 'page';
    selector = 'button';
  });

  test('Créer un submit', () => {
    const exceptedResult = ClickFactory.buildBlock(optionsDefault, frameId, frame, selector);

    expect(
      SubmitFactory.buildBlock(frameId, frame, optionsDefault, selector)
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
      SubmitFactory.generateBlock(eventMessage , frameId, frame, optionsDefault )
    ).toEqual(
      SubmitFactory.buildBlock(frameId, frame, optionsDefault, selector)
    );

  });
});