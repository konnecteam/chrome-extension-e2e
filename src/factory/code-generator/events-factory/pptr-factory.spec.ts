import { IOption } from 'interfaces/i-options';
import { IMessage } from '../../../interfaces/i-message';
import { PPtrFactory } from './pptr-factory';
import { Block } from '../../../code-generator/block';
import 'jest';
import { EPptrAction } from '../../../enum/action/pptr-actions';

/** frame et defaultOptionsDefault utilisées pour les tests */
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

describe('Test de Pptr Action Block Factory', () => {

  // Initialisation PPtrFactory
  beforeAll(() => {
    frame = 'page';
    frameId = 0;

  });

  test('Test de build de GOTO', () => {
    const href = 'localhost';

    const exceptedResult = new Block(frameId, {
      type : EPptrAction.GOTO,
      value : `await ${frame}.goto('${href}');`
    });

    exceptedResult.addLine({
      type : EPptrAction.GOTO,
      value : `await page.waitForTimeout(1000);
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
      type : EPptrAction.VIEWPORT,
      value : `await ${frame}.setViewport({ width: ${width}, height: ${height} });`
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
    defaultOptions.waitForNavigation = true;

    const exceptedResult = new Block(frameId, {
      type : EPptrAction.NAVIGATION,
      value : `await navigationPromise`
    });

    expect(
      PPtrFactory.buildWaitForNavigationBlock(
        defaultOptions,
        frameId
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build WaitForNavigation avec option WaitForNavigation desactivée', () => {
    defaultOptions.waitForNavigation = false;

    const exceptedResult = new Block(frameId);

    expect(
      PPtrFactory.buildWaitForNavigationBlock(
        defaultOptions,
        frameId
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de generate d\'un GOTO ', () => {

    const eventMessage : IMessage = {
      action : EPptrAction.GOTO,
      value : 'localhost'
    };

    expect(
      PPtrFactory.buildBlock(eventMessage , frameId, frame, defaultOptions)
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
      action : EPptrAction.VIEWPORT,
      value : { width : 1920, height : 1080}
    };

    expect(
      PPtrFactory.buildBlock(eventMessage , frameId, frame, defaultOptions)
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
      action : EPptrAction.NAVIGATION,
    };

    expect(
      PPtrFactory.buildBlock(eventMessage , frameId, frame, defaultOptions)
    ).toEqual(
      PPtrFactory.buildWaitForNavigationBlock(
        defaultOptions,
        frameId
      )
    );
  });
});