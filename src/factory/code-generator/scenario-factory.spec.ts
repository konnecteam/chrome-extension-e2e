import { PPtrActionBlockFactory } from './block-event-factory/pptr-action-block-factory';
import { KeydownBlockFactory } from './block-event-factory/keydown-block-factory';
import { SubmitBlockFactory } from './block-event-factory/submit-block-factory';
import { DropBlockFactory } from './block-event-factory/drop-block-factory';
import { ChangeBlockFactory } from './block-event-factory/change-block-factory';
import { ClickBlockFactory } from './block-event-factory/click-block-factory';
import { defaults } from './../../constants/default-options';
import actionEvents from '../../constants/action-events';
import domEventsToRecord from '../../constants/dom-events-to-record';
import { EventModel } from './../../models/event-model';
import { Block } from '../../code-generator/block';
import 'jest';
import { ScenarioFactory } from './scenario-factory';
import pptrActions from '../../constants/pptr-actions';

/** Frame définie pour les tests */
const frameId = 0;
const frame = 'page';

describe('Test de Scenario Factory', () => {

  test('Test de generate cutome ligne', () => {

    const customLine = 'await page.waitFor(1500);';
    expect(
      ScenarioFactory.generateCustomLine(
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
      ScenarioFactory.generateBlankLine()
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
      ScenarioFactory.generateScroll(frameId, frame, scrollX, scrollY)
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
      ScenarioFactory.generateNavigationVar(frameId)
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
      ScenarioFactory.generateComments(block, comment)
    ).toEqual(
      blockResult
    );
  });


  test('Test de generate Click event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.CLICK,
      selector : '#id',
      action : actionEvents.BASIC_CLICK
    };

    expect(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults)
    ).toEqual(
      ClickBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });


  test('Test de generate Change event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.CHANGE,
      selector : '#id',
      action : actionEvents.CHANGE,
      value: 'content'
    };
    expect(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults)
    ).toEqual(
      ChangeBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });


  test('Test de generate Drop event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.DROP,
      selector : '#id',
      action : actionEvents.DROP_DROPZONE,
      files : 'text.txt'
    };

    expect(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults)
    ).toEqual(
      DropBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });

  test('Test de generate Submit event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.SUBMIT,
      selector : '#id',
      action : actionEvents.SUBMIT
    };

    expect(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults)
    ).toEqual(
      SubmitBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });

  test('Test de generate Kedown event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.KEYDOWN,
      selector : '#id',
      action : actionEvents.LISTKEYDOWN,
      value : 'content',
      iframe : '#iframe'
    };

    expect(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults)
    ).toEqual(
      KeydownBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });

  test('Test de generate PPtr action event', () => {
    const eventModel : EventModel = {
      typeEvent : pptrActions.pptr,
      selector : '#id',
      action : actionEvents.GOTO,
      value : 'localhost'
    };

    expect(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults)
    ).toEqual(
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });
});