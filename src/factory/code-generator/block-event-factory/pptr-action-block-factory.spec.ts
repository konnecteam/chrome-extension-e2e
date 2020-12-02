import { defaults } from './../../../constants/default-options';
import { PPtrActionBlockFactory } from './pptr-action-block-factory';
import { Block } from '../../../code-generator/block';
import 'mocha';
import * as assert from 'assert';
import pptrActions from '../../../constants/pptr-actions';

/** Frame définie pour les tests */
const frame = 'page';
const frameId = 0;

describe('Test de Pptr Action Block Factory', () => {

  before('Initialisation PPtrActionBlockFactory', () => {
    PPtrActionBlockFactory.options = JSON.parse(JSON.stringify(defaults));
    PPtrActionBlockFactory.frame = frame;
    PPtrActionBlockFactory.frameId = frameId;

  });

  it('Test de build de GOTO', () => {
    const href = 'localhost';

    const exceptedResult = new Block(frameId, {
      type: pptrActions.GOTO,
      value: `await ${frame}.goto('${href}');`
    });

    assert.deepStrictEqual(PPtrActionBlockFactory.buildGoto(href), exceptedResult);
  });

  it('Test de build ViewPort', () => {

    const width = 1920;
    const height = 1080;
    const exceptedResult = new Block(frameId, {
      type: pptrActions.VIEWPORT,
      value: `await ${frame}.setViewport({ width: ${width}, height: ${height} });`
    });

    assert.deepStrictEqual(
      PPtrActionBlockFactory.buildViewport(
        width,
        height
      ),
      exceptedResult
    );

  });

  it('Test de build WaitForNavigation avec option WaitForNavigation activée', () => {
    PPtrActionBlockFactory.options.waitForNavigation = true;

    const exceptedResult = new Block(frameId, {
      type: pptrActions.NAVIGATION,
      value: `await navigationPromise`
    });

    assert.deepStrictEqual(PPtrActionBlockFactory.buildWaitForNavigation(), exceptedResult);
  });

  it('Test de build WaitForNavigation avec option WaitForNavigation desactivée', () => {
    PPtrActionBlockFactory.options.waitForNavigation = false;

    const exceptedResult = new Block(frameId);

    assert.deepStrictEqual(PPtrActionBlockFactory.buildWaitForNavigation(), exceptedResult);
  });

  it('Test de generate d\'un GOTO ', () => {

    const eventModel = {
      action : pptrActions.GOTO,
      value : 'localhost'
    };

    assert.deepStrictEqual(
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults),
      PPtrActionBlockFactory.buildGoto(eventModel.value)
    );
  });

  it('Test de generate d\'un ViewPort ', () => {
    const eventModel = {
      action : pptrActions.VIEWPORT,
      value : { width : 1920, height : 1080}
    };

    assert.deepStrictEqual(
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults),
      PPtrActionBlockFactory.buildViewport(eventModel.value.width, eventModel.value.height)
    );
  });

  it('Test de generate d\'un WaitForNavigation ', () => {
    const eventModel = {
      action : pptrActions.NAVIGATION,
    };

    assert.deepStrictEqual(
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults),
      PPtrActionBlockFactory.buildWaitForNavigation()
    );
  });
});