import { PPtrFactory } from './events-factory/pptr-factory';
import { KeydownFactory } from './events-factory/keydown-factory';
import { SubmitFactory } from './events-factory/submit-factory';
import { DropFactory } from './events-factory/drop-factory';
import { ChangeFactory } from './events-factory/change-factory';
import { ClickFactory } from './events-factory/click-factory';
import customEvents from '../../constants/events/events-custom';
import domEventsToRecord from '../../constants/events/events-dom';
import { IMessage } from '../../interfaces/i-message';
import { Block } from '../../code-generator/block';
import 'jest';
import { ScenarioFactory } from './scenario-factory';
import pptrActions from '../../constants/pptr-actions';
import eventsDom from '../../constants/events/events-dom';

/** Frame définie pour les tests */
const frameId = 0;
const frame = 'page';

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

describe('Test de Scenario Factory', () => {

  test('Test de generate cutome ligne', () => {

    const customLine = 'await page.waitFor(1500);';
    expect(
      ScenarioFactory.generateCustomLineBlock(
        frameId,
        customLine
      )
    ).toEqual(
      new Block(frameId, {
        frameId,
        type: 'custom-line',
        value: customLine
      })
    );
  });

  test('Test de generate SetFrame', () => {

    const allFrames : any = [];
    allFrames[1] = 'kimoce.com';

    const allFramesResult : any = [];
    allFramesResult[1] = 'kimoce.com';

    const block = new Block(1, {
      frameId : 0, value : 'line de frame simple', type : 'line'
    });
    block.addLine({frameId: 1, type: 'line', value: 'line dans une autre frame'});

    const blockToAddResult = new Block(0);

    const declaration = `const frame_${1} = frames.find(f => f.url() === '${allFramesResult[1]}')`;

    blockToAddResult.addLineToTop(({
      type: pptrActions.FRAME_SET,
      value: declaration
    }));

    blockToAddResult.addLineToTop({
      type: pptrActions.FRAME_SET,
      value: 'let frames = await page.frames()'
    });

    delete allFramesResult[1];

    expect(
      ScenarioFactory.generateSetFrame(
        block,
        new Block(0),
        allFrames
      )
    ).toEqual(
      {allFrames : allFramesResult, block : blockToAddResult}
    );
  });

  test('Test de generate Blank Line', () => {

    expect(
      ScenarioFactory.generateBlankLineBlock()
    ).toEqual(
      new Block(undefined, {
        type: null,
        value: ''
      })
    );
  });

  test('Test de generate Scroll', () => {
    const scrollX = 150;
    const scrollY = 250;

    expect(
      ScenarioFactory.generateScrollBlock(frameId, frame, scrollX, scrollY)
    ).toEqual(
      new Block(frameId, {
        type: 'scroll',
        value: ` await ${frame}.evaluate( async function(){
        window.scroll(${scrollX}, ${scrollY});
        return Promise.resolve('finish');
      });`
      })
    );
  });

  test('Test de generate NavigationVar', () => {

    expect(
      ScenarioFactory.generateVarNavigationBlock(frameId)
    ).toEqual(
      new Block(frameId, {
        type: pptrActions.NAVIGATION_PROMISE,
        value: 'const navigationPromise = page.waitForNavigation();'
      })
    );
  });

  test('Test de generate comments', () => {
    const block = new Block(frameId, {
      value : 'test de comment',
      type : 'comment'
    });

    const comment = 'commentaire';

    const blockResult = new Block(frameId, {
      value : 'test de comment',
      type : 'comment'
    });
    blockResult.addLineToTop({value: `/** ${comment} */`});

    expect(
      ScenarioFactory.generateCommentsBlock(block, comment)
    ).toEqual(
      blockResult
    );
  });


  test('Test de generate Click event', () => {
    const eventMessage : IMessage = {
      typeEvent : domEventsToRecord.CLICK,
      selector : '#id',
      action : eventsDom.CLICK
    };

    expect(
      ScenarioFactory.parseEvent(eventMessage, frameId, frame, optionsDefault)
    ).toEqual(
      ClickFactory.generateBlock(eventMessage, frameId, frame, optionsDefault)
    );
  });


  test('Test de generate Change event', () => {
    const eventMessage : IMessage = {
      typeEvent : domEventsToRecord.CHANGE,
      selector : '#id',
      action : eventsDom.CHANGE,
      value: 'content'
    };
    expect(
      ScenarioFactory.parseEvent(eventMessage, frameId, frame, optionsDefault)
    ).toEqual(
      ChangeFactory.generateBlock(eventMessage, frameId, frame, optionsDefault)
    );
  });


  test('Test de generate Drop event', () => {
    const eventMessage : IMessage = {
      typeEvent : domEventsToRecord.DROP,
      selector : '#id',
      action : customEvents.DROP_FILE,
      files : 'text.txt'
    };

    expect(
      ScenarioFactory.parseEvent(eventMessage, frameId, frame, optionsDefault)
    ).toEqual(
      DropFactory.generateBlock(eventMessage, frameId, frame, optionsDefault)
    );
  });

  test('Test de generate Submit event', () => {
    const eventMessage : IMessage = {
      typeEvent : domEventsToRecord.SUBMIT,
      selector : '#id',
      action : customEvents.SUBMIT
    };

    expect(
      ScenarioFactory.parseEvent(eventMessage, frameId, frame, optionsDefault)
    ).toEqual(
      SubmitFactory.generateBlock(eventMessage, frameId, frame, optionsDefault)
    );
  });

  test('Test de generate Kedown event', () => {
    const eventMessage : IMessage = {
      typeEvent : domEventsToRecord.KEYDOWN,
      selector : '#id',
      action : customEvents.LIST_KEYDOWN,
      value : 'content',
      iframe : '#iframe'
    };

    expect(
      ScenarioFactory.parseEvent(eventMessage, frameId, frame, optionsDefault)
    ).toEqual(
      KeydownFactory.generateBlock(eventMessage, frameId, frame, optionsDefault)
    );
  });

  test('Test de generate PPtr action event', () => {
    const eventMessage : IMessage = {
      typeEvent : pptrActions.PPTR,
      selector : '#id',
      action : pptrActions.GOTO,
      value : 'localhost'
    };

    expect(
      ScenarioFactory.parseEvent(eventMessage, frameId, frame, optionsDefault)
    ).toEqual(
      PPtrFactory.generateBlock(eventMessage, frameId, frame, optionsDefault)
    );
  });
});