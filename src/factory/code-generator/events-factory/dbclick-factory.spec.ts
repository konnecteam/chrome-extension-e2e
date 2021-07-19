import { Block } from './../../../code-generator/block';
import { EDomEvent } from './../../../enum/events/events-dom';
import { DbClickFactory } from './dbclick-factory';
import { IOption } from 'interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import 'jest';

/** Frame utilisée pour les tests */
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

describe('Test de Double Click Factory', () => {

  // Initialisation
  beforeAll(() => {

    frameId = 0;
    frame = 'page';
  });

  test('Généré un Double click Block', () => {
    const eventMessage : IMessage = {
      typeEvent : EDomEvent.DBLCLICK,
      selector : '#test',
    };

    const exceptedResult : Block = DbClickFactory.buildBlock(eventMessage, frameId, frame, defaultOptions);

    expect(
      DbClickFactory.buildBlock(
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