import { DbClickFactory } from './events-factory/dbclick-factory';
import { IOption } from './../../interfaces/i-options';
import { PPtrFactory } from './events-factory/pptr-factory';
import { KeydownFactory } from './events-factory/keydown-factory';
import { SubmitFactory } from './events-factory/submit-factory';
import { DropFactory } from './events-factory/drop-factory';
import { ChangeFactory } from './events-factory/change-factory';
import { ClickFactory } from './events-factory/click-factory';
import { IMessage } from '../../interfaces/i-message';
import { Block } from '../../code-generator/block';
import 'jest';
import { ScenarioFactory } from './scenario-factory';
import { ECustomEvent } from '../../enum/events/events-custom';
import { EDomEvent } from '../../enum/events/events-dom';
import { EPptrAction } from '../../enum/action/pptr-actions';

/** Frame définie pour les tests */
const frameId = 0;
const frame = 'page';

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
  customLineAfterClick  : '',
  recordHttpRequest : true,
  regexHTTPrequest : '',
  customLinesBeforeEvent : `await page.evaluate(async() => {
    await konnect.engineStateService.Instance.waitForAsync(1);
  });`,
  deleteSiteData : true,
};

describe('Test de Scenario Factory', () => {

  test('Test de build cutome ligne', () => {

    const customLine = 'await page.waitFor(1500);';
    expect(
      ScenarioFactory.buildCustomLineBlock(
        frameId,
        customLine
      )
    ).toEqual(
      new Block(frameId, {
        frameId,
        type : 'custom-line',
        value : customLine
      })
    );
  });

  test('Test de build SetFrame', () => {

    const allFrames : any = [];
    allFrames[1] = 'kimoce.com';

    const allFramesResult : any = [];
    allFramesResult[1] = 'kimoce.com';

    const block = new Block(1, {
      frameId : 0, value : 'line de frame simple', type : 'line'
    });
    block.addLine({frameId : 1, type : 'line', value : 'line dans une autre frame'});

    const blockToAddResult = new Block(0);

    const declaration = `const frame_${1} = frames.find(f => f.url() === '${allFramesResult[1]}')`;

    blockToAddResult.addLineToTop(({
      type : EPptrAction.FRAME_SET,
      value : declaration
    }));

    blockToAddResult.addLineToTop({
      type : EPptrAction.FRAME_SET,
      value : 'let frames = await page.frames()'
    });

    delete allFramesResult[1];

    expect(
      ScenarioFactory.buildSetFrame(
        block,
        new Block(0),
        allFrames
      )
    ).toEqual(
      {allFrames : allFramesResult, block : blockToAddResult}
    );
  });

  test('Test de build Blank Line', () => {

    expect(
      ScenarioFactory.buildBlankLineBlock()
    ).toEqual(
      new Block(undefined, {
        type : null,
        value : ''
      })
    );
  });

  test('Test de build NavigationVar', () => {

    expect(
      ScenarioFactory.buildNavigationBlock(frameId)
    ).toEqual(
      new Block(frameId, {
        type : EPptrAction.NAVIGATION_PROMISE,
        value : 'const navigationPromise = page.waitForNavigation();'
      })
    );
  });

  test('Test de build comments', () => {
    const block = new Block(frameId, {
      value : 'test de comment',
      type : 'comment'
    });

    const comment = 'commentaire';

    const blockResult = new Block(frameId, {
      value : 'test de comment',
      type : 'comment'
    });
    blockResult.addLineToTop({value : `/** ${comment} */`});

    expect(
      ScenarioFactory.buildCommentBlock(block, comment)
    ).toEqual(
      blockResult
    );
  });


  test('Test de build Click event', () => {
    const eventMessage : IMessage = {
      typeEvent : EDomEvent.CLICK,
      selector : '#id',
      action :   EDomEvent.CLICK
    };

    expect(
      ScenarioFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    ).toEqual(
      ClickFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    );
  });


  test('Test de build Change event', () => {
    const eventMessage : IMessage = {
      typeEvent : EDomEvent.CHANGE,
      selector : '#id',
      action :   EDomEvent.CHANGE,
      value : 'content'
    };
    expect(
      ScenarioFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    ).toEqual(
      ChangeFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    );
  });


  test('Test de build Drop event', () => {
    const eventMessage : IMessage = {
      typeEvent : EDomEvent.DROP,
      selector : '#id',
      action : ECustomEvent.DROP_FILE,
      files : 'text.txt'
    };

    expect(
      ScenarioFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    ).toEqual(
      DropFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    );
  });

  test('Test de build Submit event', () => {
    const eventMessage : IMessage = {
      typeEvent : EDomEvent.SUBMIT,
      selector : '#id',
      action : ECustomEvent.SUBMIT
    };

    expect(
      ScenarioFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    ).toEqual(
      SubmitFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    );
  });

  test('Test de build Kedown event', () => {
    const eventMessage : IMessage = {
      typeEvent : EDomEvent.KEYDOWN,
      selector : '#id',
      action : ECustomEvent.LIST_KEYDOWN,
      value : 'content',
      iframe : '#iframe'
    };

    expect(
      ScenarioFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    ).toEqual(
      KeydownFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    );
  });

  test('Test de build PPtr action event', () => {
    const eventMessage : IMessage = {
      typeEvent : EPptrAction.PPTR,
      selector : '#id',
      action : EPptrAction.GOTO,
      value : 'localhost'
    };

    expect(
      ScenarioFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    ).toEqual(
      PPtrFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    );
  });

  test('Test de build double click event', () => {
    const eventMessage : IMessage = {
      typeEvent : EDomEvent.DBLCLICK,
      selector : '#id',
      action : EDomEvent.DBLCLICK
    };

    expect(
      ScenarioFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    ).toEqual(
      DbClickFactory.buildBlock(eventMessage, frameId, frame, defaultOptions)
    );
  });
});