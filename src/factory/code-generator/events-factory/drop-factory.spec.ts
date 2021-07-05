import { IOption } from 'interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { DropFactory } from './drop-factory';
import 'jest';
import { ChangeFactory } from './change-factory';
import { ECustomEvent } from '../../../enum/events/events-custom';

/** frame utilisée pour les tests */
let frame : string;
let frameId : number;

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

describe('Test de Drop Block Factory', () => {

  // Initialisation
  beforeAll(() => {

    frameId = 0;
    frame = 'page';
  });

  test('Généré un Drop Block', () => {
    const eventMessage : IMessage = {
      action : ECustomEvent.DROP_FILE,
      selector : '#test',
      files : 'text.txt'
    };

    // On rajoute d'abord la partie du click du file dropzone
    const exceptedResult = ChangeFactory.buildAcceptUploadFileChangeBlock(
      defaultOptions,
      frameId,
      frame,
      eventMessage.selector,
      eventMessage.files
    );

    expect(
      DropFactory.buildBlock(
        eventMessage,
        frameId,
        frame,
        defaultOptions
      )
    ).toEqual(
      exceptedResult
    );
  });
});