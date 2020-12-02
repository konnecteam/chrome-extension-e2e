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
import 'mocha';
import * as assert from 'assert';
import { ScenarioFactory } from './scenario-factory';
import pptrActions from '../../constants/pptr-actions';

/** Frame définie pour les tests */
const frameId = 0;
const frame = 'page';

describe('Test de Scenario Factory', () => {

  it('Test de generate cutome ligne', () => {

    const customLine = 'await page.waitFor(1500);';
    assert.deepStrictEqual(
      ScenarioFactory.generateCustomLine(
        frameId,
        customLine
      ),
      new Block(frameId, {
        frameId,
        type: 'custom-line',
        value: customLine
      })
    );
  });

  it('Test de generate SetFrame', () => {

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

    assert.deepStrictEqual(
      ScenarioFactory.generateSetFrame(
        block,
        new Block(0),
        allFrames
      ),
      {allFrames : allFramesResult, block : blockToAddResult}
    );
  });

  it('Test de generate Blank Line', () => {

    assert.deepStrictEqual(
      ScenarioFactory.generateBlankLine(),
      new Block(undefined, {
        type: null,
        value: ''
      })
    );
  });

  it('Test de generate Scroll', () => {
    const scrollX = 150;
    const scrollY = 250;

    assert.deepStrictEqual(
      ScenarioFactory.generateScroll(frameId, frame, scrollX, scrollY),
      new Block(frameId, {
        type: 'scroll',
        value: ` await ${frame}.evaluate( async function(){
        window.scroll(${scrollX}, ${scrollY});
        return Promise.resolve('finish');
      });`
      })
    );
  });

  it('Test de generate NavigationVar', () => {

    assert.deepStrictEqual(
      ScenarioFactory.generateNavigationVar(frameId),
      new Block(frameId, {
        type: pptrActions.NAVIGATION_PROMISE,
        value: 'const navigationPromise = page.waitForNavigation();'
      })
    );
  });


  it('Test de generate comments', () => {
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

    assert.deepStrictEqual(
      ScenarioFactory.generateComments(block, comment),
      blockResult
    );
  });


  it('Test de generate Click event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.CLICK,
      selector : '#id',
      action : actionEvents.BASIC_CLICK
    };

    assert.deepStrictEqual(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults),
      ClickBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });


  it('Test de generate Change event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.CHANGE,
      selector : '#id',
      action : actionEvents.CHANGE,
      value: 'content'
    };

    assert.deepStrictEqual(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults),
      ChangeBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });


  it('Test de generate Drop event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.DROP,
      selector : '#id',
      action : actionEvents.DROP_DROPZONE,
      files : 'text.txt'
    };

    assert.deepStrictEqual(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults),
      DropBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });

  it('Test de generate Submit event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.SUBMIT,
      selector : '#id',
      action : actionEvents.SUBMIT
    };

    assert.deepStrictEqual(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults),
      SubmitBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });

  it('Test de generate Kedown event', () => {
    const eventModel : EventModel = {
      typeEvent : domEventsToRecord.KEYDOWN,
      selector : '#id',
      action : actionEvents.LISTKEYDOWN,
      value : 'content',
      iframe : '#iframe'
    };

    assert.deepStrictEqual(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults),
      KeydownBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });

  it('Test de generate PPtr action event', () => {
    const eventModel : EventModel = {
      typeEvent : pptrActions.pptr,
      selector : '#id',
      action : actionEvents.GOTO,
      value : 'localhost'
    };

    assert.deepStrictEqual(
      ScenarioFactory.parseEvent(eventModel, frameId, frame, defaults),
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    );
  });
});