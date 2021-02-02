import { defaults } from './../../../constants/default-options';
import { KeydownBlockFactory } from './keydown-block-factory';
import { Block } from './../../../code-generator/block';
import 'jest';
import domEventsToRecord from '../../../constants/dom-events-to-record';

const frame = 'page';
const frameId = 0;
const iframe = 'body > iframe';
const selector = '#id';
const value = 'test de value';

describe('Test de Keydown Block Factory', () => {

  // Initialisation des attributs de Keydown block factory
  beforeAll(() => {
    KeydownBlockFactory.frame = frame;
    KeydownBlockFactory.frameId = frameId;
    KeydownBlockFactory.options = JSON.parse(JSON.stringify(defaults));
  });

  test('Test de build ListKeydown dans une iframe', () => {
    KeydownBlockFactory.options.waitForSelectorOnClick = false;
    const exceptedResult = new Block(KeydownBlockFactory.frameId);

    exceptedResult.addLine({

      type: domEventsToRecord.KEYDOWN,
      value: ` await ${frame}.evaluate( async function(){
          let iframeElement = document.querySelector('${iframe}');
          let element = iframeElement.contentDocument.querySelector('${selector}')
          element.innerHTML = \`${value}\`;
          var clickEvent = document.createEvent('KeyboardEvents');
          clickEvent.initEvent ('keyup', true, true);
          element.dispatchEvent (clickEvent);
          return Promise.resolve('finish');
        });`
    });

    expect(
      KeydownBlockFactory.buildListKeydown(
        selector,
        value,
        iframe
      )
    ).toEqual(
      exceptedResult
    );

  });

  test('Test de build ListKeydown', () => {
    const exceptedResult = new Block(KeydownBlockFactory.frameId);

    exceptedResult.addLine({

      type: 'KEYUP',
      value: ` await ${frame}.evaluate( async function(){
          let element = document.querySelector('${selector}');
          var clickEvent = document.createEvent('KeyboardEvents');
          //If it isn't input element
          if(element.value == null){
            element.innerHTML = \`${value}\`;
            clickEvent.initEvent ('keyup', true, true);
            element.dispatchEvent (clickEvent);
          } else {
            element.value = \`${value}\`;
            clickEvent.initEvent('keydown', true, true);
            element.dispatchEvent(clickEvent);
          }
          return Promise.resolve('finish');
        });`
    });

    expect(
      KeydownBlockFactory.buildListKeydown(
        selector,
        value,
        null
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build ListKeydown avec l\'option waitForSelectorOnClick', () => {

    KeydownBlockFactory.options.waitForSelectorOnClick = true;

    const exceptedResult = new Block(KeydownBlockFactory.frameId);

    exceptedResult.addLine({
      type: domEventsToRecord.CLICK,
      value: ` await ${frame}.waitForSelector('${selector}')`
    });

    exceptedResult.addLine({

      type: 'KEYUP',
      value: ` await ${frame}.evaluate( async function(){
          let element = document.querySelector('${selector}');
          var clickEvent = document.createEvent('KeyboardEvents');
          //If it isn't input element
          if(element.value == null){
            element.innerHTML = \`${value}\`;
            clickEvent.initEvent ('keyup', true, true);
            element.dispatchEvent (clickEvent);
          } else {
            element.value = \`${value}\`;
            clickEvent.initEvent('keydown', true, true);
            element.dispatchEvent(clickEvent);
          }
          return Promise.resolve('finish');
        });`
    });

    expect(
      KeydownBlockFactory.buildListKeydown(
        selector,
        value,
        null // cas qui n'est pas dans une iframe
      )
    ).toEqual(
      exceptedResult
    );
  });
});