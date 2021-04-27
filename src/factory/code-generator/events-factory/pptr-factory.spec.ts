import { IOption } from 'interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { defaults } from '../../../constants/default-options';
import { PPtrFactory } from './pptr-factory';
import { Block } from '../../../code-generator/block';
import 'jest';
import pptrActions from '../../../constants/pptr-actions';

/** frame et options utilisées pour les tests */
let frame : string;
let frameId : number;
let options : IOption;

describe('Test de Pptr Action Block Factory', () => {

  // Initialisation PPtrFactory
  beforeAll(() => {
    options = JSON.parse(JSON.stringify(defaults));
    frame = 'page';
    frameId = 0;

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
  await page.evaluate( () => {
    window.konnect.engineStateService.Instance.start();
  });`
    });
    expect(
      PPtrFactory.buildGotoBlock(frameId, frame, href)
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
      PPtrFactory.buildViewportBlock(
        frameId,
        frame,
        width,
        height
      )
    ).toEqual(
      exceptedResult
    );

  });

  test('Test de build WaitForNavigation avec option WaitForNavigation activée', () => {
    options.waitForNavigation = true;

    const exceptedResult = new Block(frameId, {
      type: pptrActions.NAVIGATION,
      value: `await navigationPromise`
    });

    expect(
      PPtrFactory.buildWaitForNavigationBlock(
        options,
        frameId,
        frame
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build WaitForNavigation avec option WaitForNavigation desactivée', () => {
    options.waitForNavigation = false;

    const exceptedResult = new Block(frameId);

    expect(
      PPtrFactory.buildWaitForNavigationBlock(
        options,
        frameId,
        frame
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de generate d\'un GOTO ', () => {

    const eventMessage : IMessage = {
      action : pptrActions.GOTO,
      value : 'localhost'
    };

    expect(
      PPtrFactory.generateBlock(eventMessage , frameId, frame, defaults)
    ).toEqual(
      PPtrFactory.buildGotoBlock(
        frameId,
        frame,
        eventMessage.value
      )
    );
  });

  test('Test de generate d\'un ViewPort ', () => {
    const eventMessage  = {
      action : pptrActions.VIEWPORT,
      value : { width : 1920, height : 1080}
    };

    expect(
      PPtrFactory.generateBlock(eventMessage , frameId, frame, defaults)
    ).toEqual(
      PPtrFactory.buildViewportBlock(
        frameId,
        frame,
        eventMessage.value.width,
        eventMessage.value.height
      )
    );
  });

  test('Test de generate d\'un WaitForNavigation ', () => {
    const eventMessage  = {
      action : pptrActions.NAVIGATION,
    };

    expect(
      PPtrFactory.generateBlock(eventMessage , frameId, frame, defaults)
    ).toEqual(
      PPtrFactory.buildWaitForNavigationBlock(
        defaults,
        frameId,
        frame
      )
    );
  });
});