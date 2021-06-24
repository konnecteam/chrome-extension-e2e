import { ChangeFactory } from './change-factory';
import { Block } from '../../../code-generator/block';
import 'jest';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from 'interfaces/i-options';

// Constant
import DOM_EVENT from '../../../constants/events/events-dom';
import CUSTOM_EVENT from '../../../constants/events/events-custom';
import TAG_NAME from '../../../constants/elements/tag-name';

/** valeur de l'élément */
const value = `testValue`;

/** Selecteurs */
const INPUT_ID = '#input';
const INPUT_NUN_ID = '#inputNum';
const SELECTOR = '#id';

/** frame et defaultOptions utilisées pour les tests */
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

describe('Test de Change Block Factory', () => {

  // Initialisation des attributs de change-block-factory
  beforeAll(() => {

    frameId = 0;
    frame = 'page';
  });

  test('Test de buildInputNumericChangedBlock', () => {

    const exceptedBlock = new Block(frameId);
    exceptedBlock.addLine({
      type: 'focus',
      value: `await page.focus('${INPUT_NUN_ID}');`
    });

    exceptedBlock.addLine({
      type: DOM_EVENT.CHANGE,
      value: `await ${frame}.evaluate( async function(){
       let input = document.querySelector('${SELECTOR}');
       input.value = '${value}';
       input.dispatchEvent(new Event('blur'));
     })`
    });

    const result = ChangeFactory.buildInputNumericChangedBlock(
      frameId,
      frame,
      SELECTOR,
      value,
      INPUT_NUN_ID
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildSelectChangeBlock', () => {

    const exceptedBlock = new Block(frameId);
    exceptedBlock.addLine({
      type: DOM_EVENT.CHANGE,
      value: `await ${frame}.select('${SELECTOR}', \`${value}\`);`
    });

    const result = ChangeFactory.buildSelectChangeBlock(
      frameId,
      frame,
      SELECTOR,
      value
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildChangeBlock', () => {

    const exceptedBlock = new Block(frameId);
    exceptedBlock.addLine({
      type: DOM_EVENT.CHANGE,
      value: `await ${frame}.evaluate( () => document.querySelector('${SELECTOR}').value = "");
      await ${frame}.type('${SELECTOR}', \`${value}\`);`
    });

    const result = ChangeFactory.buildChangeBlock(
      frameId,
      frame,
      SELECTOR,
      value
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildAcceptUploadFileChangeBlock', () => {

    // Attributs utilisés pour générer le block
    const files = '\"./recordings/files/test.txt\"';

    const exceptedBlock = new Block(frameId);
    exceptedBlock.addLine({
      type: DOM_EVENT.DROP,
      value: ` await fileChooser.accept([${files}]);`
    });

    const result = ChangeFactory.buildAcceptUploadFileChangeBlock(
      frameId,
      'test.txt'
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildBlock pour un change input numeric', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector: SELECTOR,
      value,
      selectorFocus: INPUT_ID,
      action : CUSTOM_EVENT.CHANGE_INPUT_NUMERIC
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame
      )
    ).toEqual(
      ChangeFactory.buildInputNumericChangedBlock(
        frameId,
        frame,
        SELECTOR,
        value,
        INPUT_ID
      )
    );

  });

  test('Test de buildBlock pour un change simple', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector: SELECTOR,
      value,
      action : DOM_EVENT.CHANGE
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame
      )
    ).toEqual(
      ChangeFactory.buildChangeBlock(
        frameId,
        frame,
        SELECTOR,
        value
      )
    );
  });

  test('Test de buildBlock pour un select change', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector: SELECTOR,
      value,
      action : DOM_EVENT.CHANGE,
      tagName : TAG_NAME.SELECT.toUpperCase()
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame
      )
    ).toEqual(
      ChangeFactory.buildSelectChangeBlock(
        frameId,
        frame,
        SELECTOR,
        value
      )
    );
  });


  test('Test de buildBlock pour un input file', () => {
    // Attributs utilisés pour générer le block
    const files = 'test.txt';
    const eventMessage : IMessage = {
      selector: SELECTOR,
      value,
      action : DOM_EVENT.CHANGE,
      files
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame
      )
    ).toEqual(
      ChangeFactory.buildAcceptUploadFileChangeBlock(
        frameId,
        files
      )
    );
  });
});