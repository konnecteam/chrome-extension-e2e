import { ChangeBlockFactory } from './change-block-factory';
import { Block } from './../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import actionEvents from '../../../constants/action-events';
import elementsTagName from '../../../constants/elements-tagName';
import { IMessage } from '../../../interfaces/i-message';

/** selecteur de l'élément */
const selector = '#id';
/** valeur de l'élément */
const value = `testValue`;

describe('Test de Change Block Factory', () => {

  // Initialisation des attributs de change-block-factory
  beforeAll(() => {

    ChangeBlockFactory.options = JSON.parse(JSON.stringify(defaults));
    ChangeBlockFactory.frameId = 0;
    ChangeBlockFactory.frame = 'page';
  });

  test('Test de buildChangeInputNumeric', () => {

    // Attributs utilisés pour générer le block
    const selectorFocus = '#inputNum';

    const exceptedBlock = new Block(ChangeBlockFactory.frameId);
    exceptedBlock.addLine({
      type: 'focus',
      value: `await page.focus('${selectorFocus}');`
    });

    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeBlockFactory.frame}.evaluate( async function(){
       let input = document.querySelector('${selector}');
       input.value = '${value}';
       input.dispatchEvent(new Event('blur'));
       return Promise.resolve('finish');
     })`
    });

    const result = ChangeBlockFactory.buildChangeInputNumeric(
      selector,
      value,
      selectorFocus
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildSelectChange', () => {

    const exceptedBlock = new Block(ChangeBlockFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeBlockFactory.frame}.select('${selector}', \`${value}\`);`
    });

    const result = ChangeBlockFactory.buildSelectChange(
      selector,
      value
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildChange', () => {

    const exceptedBlock = new Block(ChangeBlockFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeBlockFactory.frame}.evaluate( () => document.querySelector('${selector}').value = "");
      await ${ChangeBlockFactory.frame}.type('${selector}', \`${value}\`);`
    });

    const result = ChangeBlockFactory.buildChange(
      selector,
      value
    );

    expect(result).toEqual(exceptedBlock);
  });

  test('Test de buildAcceptUploadFileChange', () => {

    // Attributs utilisés pour générer le block
    const files = '\"./recordings/files/test.txt\"';

    const exceptedBlock = new Block(ChangeBlockFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.DROP,
      value: ` await fileChooser.accept([${files}]);`
    });

    const result = ChangeBlockFactory.buildAcceptUploadFileChange(
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
      action : actionEvents.CHANGE_INPUTNUMERIC
    };

    expect(
      ChangeBlockFactory.generateBlock(
        eventMessage ,
        ChangeBlockFactory.frameId,
        ChangeBlockFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeBlockFactory.buildChangeInputNumeric(
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
      action : actionEvents.CHANGE
    };

    expect(
      ChangeBlockFactory.generateBlock(
        eventMessage ,
        ChangeBlockFactory.frameId,
        ChangeBlockFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeBlockFactory.buildChange(
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
      action : actionEvents.CHANGE,
      tagName : elementsTagName.SELECT.toUpperCase()
    };

    expect(
      ChangeBlockFactory.generateBlock(
        eventMessage ,
        ChangeBlockFactory.frameId,
        ChangeBlockFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeBlockFactory.buildSelectChange(
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
      action : actionEvents.CHANGE,
      files
    };

    expect(
      ChangeBlockFactory.generateBlock(
        eventMessage ,
        ChangeBlockFactory.frameId,
        ChangeBlockFactory.frame,
        defaults
      )
    ).toEqual(
      ChangeBlockFactory.buildAcceptUploadFileChange(
        selector,
        files
      )
    );
  });
});