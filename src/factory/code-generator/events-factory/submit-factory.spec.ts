import { ClickFactory } from './click-factory';
import { IOption } from '../../../interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { SubmitFactory } from './submit-factory';
import 'jest';

// Constant
import CUSTOM_EVENT from '../../../constants/events/events-custom';
import TAG_NAME from '../../../constants/elements/tag-name';

/** Frame définie pour les tests */
let frameId = 0;
let frame = 'page';

/**
 * Options
 */
const defaultOptions : IOption = {
  wrapAsync : true,
  headless : false,
  waitForNavigation : true,
  waitForSelectorOnClick : true,
  blankLinesBetweenBlocks : true,
  dataAttribute : '',
  useRegexForDataAttribute : false,
  customLineAfterClick : '',
  recordHttpRequest : true,
  regexHTTPrequest : '',
  customLinesBeforeEvent : `await page.evaluate(async() => {
    await konnect.engineStateService.Instance.waitForAsync(1);
  });`,
  deleteSiteData : true,
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

  test('généré un block pour submit dans un formulaire', () => {
    const eventMessage : IMessage = {
      tagName : TAG_NAME.FORM.toUpperCase(),
      action : CUSTOM_EVENT.SUBMIT,
      submitterSelector : selector
    };

    expect(
      SubmitFactory.buildBlock(eventMessage , frameId, frame, defaultOptions )
    ).toEqual(
      ClickFactory.buildSimpleClickBlock(defaultOptions, frameId, frame, selector)
    );

  });
});