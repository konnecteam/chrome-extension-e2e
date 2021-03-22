import { defaults } from '../../../constants/default-options';
import { KeydownFactory } from './keydown-factory';
import { Block } from '../../../code-generator/block';
import 'jest';
import domEventsToRecord from '../../../constants/events/events-dom';

const frame = 'page';
const frameId = 0;
const iframe = 'body > iframe';
const selector = '#id';
const value = 'test de value';

describe('Test de Keydown Block Factory', () => {

  // Initialisation des attributs de Keydown block factory
  beforeAll(() => {
    KeydownFactory.frame = frame;
    KeydownFactory.frameId = frameId;
    KeydownFactory.options = JSON.parse(JSON.stringify(defaults));
  });

  test('Test de build ListKeydown dans une iframe', () => {
    KeydownFactory.options.waitForSelectorOnClick = false;
    const exceptedResult = new Block(KeydownFactory.frameId);

    exceptedResult.addLine({

      type: domEventsToRecord.KEYDOWN,
      value: ` await ${frame}.evaluate( async function(){
          let iframeElement = document.querySelector('${iframe}');
          let element = iframeElement.contentDocument.querySelector('${selector}');
          element.className = '';
          element.innerHTML = \`${value}\`;
          var docEvent = document.createEvent('KeyboardEvents');
          docEvent.initEvent ('keyup', true, true);
          element.dispatchEvent (docEvent);
          return Promise.resolve('finish');
        });`
    });

    expect(
      KeydownFactory.buildListKeydownBlock(
        selector,
        value,
        iframe
      )
    ).toEqual(
      exceptedResult
    );

  });

  test('Test de build ListKeydown', () => {
    const exceptedResult = new Block(KeydownFactory.frameId);

    exceptedResult.addLine({

      type: 'KEYUP',
      value: ` await ${frame}.evaluate( async function(){
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
          return Promise.resolve('finish');
        });`
    });

    expect(
      KeydownFactory.buildListKeydownBlock(
        selector,
        value,
        null
      )
    ).toEqual(
      exceptedResult
    );
  });

  test('Test de build ListKeydown avec l\'option waitForSelectorOnClick', () => {

    KeydownFactory.options.waitForSelectorOnClick = true;

    const exceptedResult = new Block(KeydownFactory.frameId);

    exceptedResult.addLine({
      type: domEventsToRecord.CLICK,
      value: ` await ${frame}.waitForSelector('${selector}')`
    });

    exceptedResult.addLine({

      type: 'KEYUP',
      value: ` await ${frame}.evaluate( async function(){
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
          return Promise.resolve('finish');
        });`
    });

    expect(
      KeydownFactory.buildListKeydownBlock(
        selector,
        value,
        null // cas qui n'est pas dans une iframe
      )
    ).toEqual(
      exceptedResult
    );
  });
});