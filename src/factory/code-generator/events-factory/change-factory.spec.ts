import { ClickFactory } from './click-factory';
import { ChangeFactory } from './change-factory';
import { Block } from '../../../code-generator/block';
import 'jest';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from 'interfaces/i-options';
import { ETagName } from '../../../enum/elements/tag-name';
import { ECustomEvent } from '../../../enum/events/events-custom';

// Constant
import { EDomEvent } from '../../../enum/events/events-dom';

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

describe('Test de Change Block Factory', () => {

  // Initialisation des attributs de change-block-factory
  beforeAll(() => {

    frameId = 0;
    frame = 'page';
  });

  test('Test de buildInputNumericChangedBlock', () => {

    const exceptedBlock = new Block(frameId);
    exceptedBlock.addLine({
      type : 'focus',
      value : `await page.focus('${INPUT_NUN_ID}');`
    });

    exceptedBlock.addLine({
      type : EDomEvent.CHANGE,
      value : `await ${frame}.evaluate( async function(){
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
      type : EDomEvent.CHANGE,
      value : `await ${frame}.select('${SELECTOR}', \`${value}\`);`
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
      type : EDomEvent.CHANGE,
      value : `await ${frame}.evaluate( () => document.querySelector('${SELECTOR}').value = "");
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

    const exceptedBlock = ClickFactory.buildFileDropZoneClickBlock(defaultOptions, frameId, frame, SELECTOR);

    exceptedBlock.addLine({
      type : EDomEvent.DROP,
      value : ` await fileChooser.accept([${files}]);`
    });

    const result = ChangeFactory.buildAcceptUploadFileChangeBlock(
      defaultOptions,
      frameId,
      frame,
      SELECTOR,
      'test.txt'
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildBlock pour un change input numeric', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector : SELECTOR,
      value,
      selectorFocus : INPUT_ID,
      action : ECustomEvent.CHANGE_INPUT_NUMERIC
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame,
        defaultOptions
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
      selector : SELECTOR,
      value,
      action : EDomEvent.CHANGE
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame,
        defaultOptions
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
      selector : SELECTOR,
      value,
      action : EDomEvent.CHANGE,
      tagName : ETagName.SELECT.toUpperCase()
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame,
        defaultOptions
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
      selector : SELECTOR,
      value,
      action : EDomEvent.CHANGE,
      files
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame,
        defaultOptions
      )
    ).toEqual(
      ChangeFactory.buildAcceptUploadFileChangeBlock(
        defaultOptions,
        frameId,
        frame,
        SELECTOR,
        files
      )
    );
  });

  test('Test de buildChangeTagsListBlock pour un lists tags', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector : SELECTOR,
      value,
      action : ECustomEvent.CHANGE_TAGS_LIST,
    };

    expect(
      ChangeFactory.buildBlock(
        eventMessage ,
        frameId,
        frame,
        defaultOptions
      )
    ).toEqual(
      ChangeFactory.buildChangeTagsListBlock(
        frameId,
        frame,
        SELECTOR,
        value
      )
    );
  });
});