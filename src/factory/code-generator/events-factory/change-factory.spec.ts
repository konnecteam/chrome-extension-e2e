import { ChangeFactory } from './change-factory';
import { Block } from '../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import domEventsToRecord from '../../../constants/events/events-dom';
import customEvents from '../../../constants/events/events-custom';
import elementsTagName from '../../../constants/elements/tag-name';
import { IMessage } from '../../../interfaces/i-message';
import eventsDom from '../../../constants/events/events-dom';
/** selecteur de l'élément */
const selector = '#id';
/** valeur de l'élément */
const value = `testValue`;

describe('Test de Change Block Factory', () => {

  // Initialisation des attributs de change-block-factory
  beforeAll(() => {

    ChangeFactory.options = JSON.parse(JSON.stringify(defaults));
    ChangeFactory.frameId = 0;
    ChangeFactory.frame = 'page';
  });

  test('Test de buildChangeBlockInputNumericBlock', () => {

    // Attributs utilisés pour générer le block
    const selectorFocus = '#inputNum';

    const exceptedBlock = new Block(ChangeFactory.frameId);
    exceptedBlock.addLine({
      type: 'focus',
      value: `await page.focus('${selectorFocus}');`
    });

    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeFactory.frame}.evaluate( async function(){
       let input = document.querySelector('${selector}');
       input.value = '${value}';
       input.dispatchEvent(new Event('blur'));
       return Promise.resolve('finish');
     })`
    });

    const result = ChangeFactory.buildChangeBlockInputNumericBlock(
      selector,
      value,
      selectorFocus
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildSelectChangeBlock', () => {

    const exceptedBlock = new Block(ChangeFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeFactory.frame}.select('${selector}', \`${value}\`);`
    });

    const result = ChangeFactory.buildSelectChangeBlock(
      selector,
      value
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildChangeBlock', () => {

    const exceptedBlock = new Block(ChangeFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeFactory.frame}.evaluate( () => document.querySelector('${selector}').value = "");
      await ${ChangeFactory.frame}.type('${selector}', \`${value}\`);`
    });

    const result = ChangeFactory.buildChangeBlock(
      selector,
      value
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildAcceptUploadFileChangeBlock', () => {

    // Attributs utilisés pour générer le block
    const files = '\"./recordings/files/test.txt\"';

    const exceptedBlock = new Block(ChangeFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.DROP,
      value: ` await fileChooser.accept([${files}]);`
    });

    const result = ChangeFactory.buildAcceptUploadFileChangeBlock(
      selector,
      'test.txt'
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de generateBlock pour un change input numeric', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector,
      value,
      selectorFocus: '#input',
      action : customEvents.CHANGE_INPUT_NUMERIC
    };

    expect(
      ChangeFactory.generateBlock(
        eventMessage ,
        ChangeFactory.frameId,
        ChangeFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeFactory.buildChangeBlockInputNumericBlock(
        selector,
        value,
        '#input'
      )
    );

  });

  test('Test de generateBlock pour un change simple', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector,
      value,
      action : eventsDom.CHANGE
    };

    expect(
      ChangeFactory.generateBlock(
        eventMessage ,
        ChangeFactory.frameId,
        ChangeFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeFactory.buildChangeBlock(
        selector,
        value
      )
    );
  });

  test('Test de generateBlock pour un select change', () => {
    // Attributs utilisés pour générer le block
    const eventMessage : IMessage = {
      selector,
      value,
      action : eventsDom.CHANGE,
      tagName : elementsTagName.SELECT.toUpperCase()
    };

    expect(
      ChangeFactory.generateBlock(
        eventMessage ,
        ChangeFactory.frameId,
        ChangeFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeFactory.buildSelectChangeBlock(
        selector,
        value
      )
    );
  });


  test('Test de generateBlock pour un input file', () => {
    // Attributs utilisés pour générer le block
    const files = 'test.txt';
    const eventMessage : IMessage = {
      selector,
      value,
      action : eventsDom.CHANGE,
      files
    };

    expect(
      ChangeFactory.generateBlock(
        eventMessage ,
        ChangeFactory.frameId,
        ChangeFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeFactory.buildAcceptUploadFileChangeBlock(
        selector,
        files
      )
    );
  });
});