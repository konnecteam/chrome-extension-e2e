import { defaults } from './../../../constants/default-options';
import { PPtrActionBlockFactory } from './pptr-action-block-factory';
import { Block } from '../../../code-generator/block';
import 'jest';
import pptrActions from '../../../constants/pptr-actions';

/** Frame définie pour les tests */
const frame = 'page';
const frameId = 0;

describe('Test de Pptr Action Block Factory', () => {

  // Initialisation PPtrActionBlockFactory
  beforeAll(() => {
    PPtrActionBlockFactory.options = JSON.parse(JSON.stringify(defaults));
    PPtrActionBlockFactory.frame = frame;
    PPtrActionBlockFactory.frameId = frameId;

  });

  test('Test de build de GOTO', () => {
    const href = 'localhost';

    const exceptedResult = new Block(frameId, {
      type: pptrActions.GOTO,
      value: `await ${frame}.goto('${href}');`
    });

    exceptedResult.addLine({
      type: pptrActions.GOTO,
      value: `await page.waitForTimeout(1000);
  await page.evaluate(content => {
    window.konnect.engineStateService.Instance.start();
  });`
    });
    expect(
      PPtrActionBlockFactory.buildGoto(href)
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build ViewPort', () => {

    const width = 1920;
    const height = 1080;
    const exceptedResult = new Block(frameId, {
      type: pptrActions.VIEWPORT,
      value: `await ${frame}.setViewport({ width: ${width}, height: ${height} });`
    });

    expect(
      PPtrActionBlockFactory.buildViewport(
        width,
        height
      )
    ).toEqual(
      exceptedResult
    );

  });

  test('Test de build WaitForNavigation avec option WaitForNavigation activée', () => {
    PPtrActionBlockFactory.options.waitForNavigation = true;

    const exceptedResult = new Block(frameId, {
      type: pptrActions.NAVIGATION,
      value: `await navigationPromise`
    });

    expect(
      PPtrActionBlockFactory.buildWaitForNavigation()
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build WaitForNavigation avec option WaitForNavigation desactivée', () => {
    PPtrActionBlockFactory.options.waitForNavigation = false;

    const exceptedResult = new Block(frameId);

    expect(
      PPtrActionBlockFactory.buildWaitForNavigation()
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de generate d\'un GOTO ', () => {

    const eventModel = {
      action : pptrActions.GOTO,
      value : 'localhost'
    };

    expect(
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    ).toEqual(
      PPtrActionBlockFactory.buildGoto(eventModel.value)
    );
  });

  test('Test de generate d\'un ViewPort ', () => {
    const eventModel = {
      action : pptrActions.VIEWPORT,
      value : { width : 1920, height : 1080}
    };

    expect(
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    ).toEqual(
      PPtrActionBlockFactory.buildViewport(eventModel.value.width, eventModel.value.height)
    );
  });

  test('Test de generate d\'un WaitForNavigation ', () => {
    const eventModel = {
      action : pptrActions.NAVIGATION,
    };

    expect(
      PPtrActionBlockFactory.generateBlock(eventModel, frameId, frame, defaults)
    ).toEqual(
      PPtrActionBlockFactory.buildWaitForNavigation()
    );
  });
});