import { IOption } from 'interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { DropFactory } from './drop-factory';
import 'jest';
import customEvents from '../../../constants/events/events-custom';
import { ClickFactory } from './click-factory';
import { ChangeFactory } from './change-factory';

/** frame utilisée pour les tests */
let frame : string;
let frameId : number;

/**
 * Options
 */
const defaultOptions : IOption = {
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
describe('Test de Drop Block Factory', () => {

  // Initialisation
  beforeAll(() => {

    frameId = 0;
    frame = 'page';
  });

  test('Généré un Drop Block', () => {
    const eventMessage : IMessage = {
      action : customEvents.DROP_FILE,
      selector: '#test',
      files : 'text.txt'
    };

    // On rajoute d'abord la partie du click du file dropzone
    const exceptedResult = ClickFactory.buildclickFileDropZoneBlock(
      defaultOptions,
      frameId,
      frame,
      eventMessage.selector
    );
    // On rajoute la partie acceptation du fichier
    const chooserFile = ChangeFactory.buildAcceptUploadFileChangeBlock(
      frameId,
      eventMessage.files
    );
    exceptedResult.addLine(chooserFile.getLines()[0]);

    expect(
      DropFactory.generateBlock(
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