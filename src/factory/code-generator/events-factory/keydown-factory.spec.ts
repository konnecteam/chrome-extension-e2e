import { ECustomEvent } from './../../../enum/events/events-custom';
import { IMessage } from 'interfaces/i-message';
import { IOption } from 'interfaces/i-options';
import { KeydownFactory } from './keydown-factory';
import { Block } from '../../../code-generator/block';
import 'jest';

// Constant
import { EDomEvent } from '../../../enum/events/events-dom';

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

const iframe = 'body > iframe';
const selector = '#id';
const value = 'test de value';

describe('Test de Keydown Block Factory', () => {

  // Initialisation des attributs de Keydown block factory
  beforeAll(() => {
    frame = 'page';
    frameId = 0;
  });

  test('Test de build ListKeydown dans une iframe', () => {
    defaultOptions.waitForSelectorOnClick = false;
    const exceptedResult = new Block(frameId);

    exceptedResult.addLine({

      type : EDomEvent.KEYDOWN,
      value : ` await ${frame}.evaluate( async function(){
          let iframeElement = document.querySelector('${iframe}');
          let element = iframeElement.contentDocument.querySelector('${selector}');
          element.className = '';
          element.innerHTML = \`${value}\`;
          var docEvent = document.createEvent('KeyboardEvents');
          docEvent.initEvent ('keyup', true, true);
          element.dispatchEvent (docEvent);
        });`
    });

    expect(
      KeydownFactory.buildListKeydownBlock(
        defaultOptions,
        frameId,
        frame,
        selector,
        value,
        iframe
      )
    ).toEqual(
      exceptedResult
    );

  });

  test('Test de build ListKeydown', () => {
    const exceptedResult = new Block(frameId);

    exceptedResult.addLine({

      type : 'KEYUP',
      value : ` await ${frame}.evaluate( async function(){
          let element = document.querySelector('${selector}');
          var docEvent = document.createEvent('KeyboardEvents');
          //If it isn't input element
          if(element.value == null){
            element.className = '';
            element.innerHTML = \`${value}\`;
            docEvent.initEvent ('keyup', true, true);
            element.dispatchEvent (docEvent);
          } else {
            element.value = \`${value}\`;
            docEvent.initEvent('keydown', true, true);
            element.dispatchEvent(docEvent);
          }
        });`
    });

    expect(
      KeydownFactory.buildListKeydownBlock(
        defaultOptions,
        frameId,
        frame,
        selector,
        value,
        null
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build ListKeydown avec l\'option waitForSelectorOnClick', () => {

    defaultOptions.waitForSelectorOnClick = true;

    const exceptedResult = new Block(frameId);

    exceptedResult.addLine({
      type : EDomEvent.CLICK,
      value : ` await ${frame}.waitForSelector('${selector}')`
    });

    exceptedResult.addLine({

      type : 'KEYUP',
      value : ` await ${frame}.evaluate( async function(){
          let element = document.querySelector('${selector}');
          var docEvent = document.createEvent('KeyboardEvents');
          //If it isn't input element
          if(element.value == null){
            element.className = '';
            element.innerHTML = \`${value}\`;
            docEvent.initEvent ('keyup', true, true);
            element.dispatchEvent (docEvent);
          } else {
            element.value = \`${value}\`;
            docEvent.initEvent('keydown', true, true);
            element.dispatchEvent(docEvent);
          }
        });`
    });

    expect(
      KeydownFactory.buildListKeydownBlock(
        defaultOptions,
        frameId,
        frame,
        selector,
        value,
        null // cas qui n'est pas dans une iframe
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build ListKeydown text editor', () => {
    const exceptedResult = new Block(frameId);
    exceptedResult.addLine({
      type : EDomEvent.CLICK,
      value : ` await ${frame}.waitForSelector('${selector}')`
    });
    exceptedResult.addLine({

      type : EDomEvent.KEYDOWN,
      value : ` await ${frame}.evaluate( async function(){
        let element = document.querySelector('${selector}');
        element.au['text-editor'].viewModel.quill.clipboard.dangerouslyPasteHTML('${value}');
      });`
    });

    expect(
      KeydownFactory.buildListKeydownEditorBlock(
        defaultOptions,
        frameId,
        frame,
        selector,
        value
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('test de generate de buildBlock pour un list keydown', () => {

    const event : IMessage = {
      action : ECustomEvent.LIST_KEYDOWN,
      selector : '#test',
      value : 'test de keydown list',
      iframe : null
    };

    expect(
      KeydownFactory.buildBlock(
        event,
        frameId,
        frame,
        defaultOptions
      )
    )
    .toEqual(
      KeydownFactory.buildListKeydownBlock(
        defaultOptions,
        frameId,
        frame,
        event.selector,
        event.value,
        event.iframe
      )
    );

  });

  test('test de generate de buildBlock pour un list keydown de text editor', () => {

    const event : IMessage = {
      action : ECustomEvent.LIST_KEYDOWN_EDITOR,
      selector : '#test',
      value : 'test de keydown list',
      iframe : null
    };

    expect(
      KeydownFactory.buildBlock(
        event,
        frameId,
        frame,
        defaultOptions
      )
    )
    .toEqual(
      KeydownFactory.buildListKeydownEditorBlock(
        defaultOptions,
        frameId,
        frame,
        event.selector,
        event.value
      )
    );

  });
});