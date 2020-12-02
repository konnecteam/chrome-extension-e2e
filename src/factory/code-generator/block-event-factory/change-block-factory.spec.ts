import { ChangeBlockFactory } from './change-block-factory';
import { Block } from './../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'mocha';
import * as assert from 'assert';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import actionEvents from '../../../constants/action-events';
import elementsTagName from '../../../constants/elements-tagName';

/** selecteur de l'élément */
const selector = '#id';
/** valeur de l'élément */
const value = 'testValue';

describe('Test de Change Block Factory', () => {

  before('Initialisation des attributs de change-block-factory ', () => {

    ChangeBlockFactory.options = JSON.parse(JSON.stringify(defaults));
    ChangeBlockFactory.frameId = 0;
    ChangeBlockFactory.frame = 'page';
  });

  it('Test de buildChangeInputNumeric', () => {

    // Attributs utilisé pour générer le block
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
       input.value = "${value}";
       input.dispatchEvent(new Event('blur'));
       return Promise.resolve('finish');
     })`
    });

    const result = ChangeBlockFactory.buildChangeInputNumeric(
      selector,
      value,
      selectorFocus
    );

    assert.deepStrictEqual(result, exceptedBlock);
  });

  it('Test de buildSelectChange', () => {

    const exceptedBlock = new Block(ChangeBlockFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeBlockFactory.frame}.select('${selector}', '${value}');`
    });

    const result = ChangeBlockFactory.buildSelectChange(
      selector,
      value
    );

    assert.deepStrictEqual(result, exceptedBlock);
  });

  it('Test de buildChange', () => {

    const exceptedBlock = new Block(ChangeBlockFactory.frameId);
    exceptedBlock.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${ChangeBlockFactory.frame}.evaluate( () => document.querySelector('${selector}').value = "");\n await ${ChangeBlockFactory.frame}.type('${selector}', '${value}');`
    });

    const result = ChangeBlockFactory.buildChange(
      selector,
      value
    );

    assert.deepStrictEqual(result, exceptedBlock);
  });

  it('Test de buildAcceptUploadFileChange', () => {

    // Attributs utilisé pour générer le block
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

    assert.deepStrictEqual(result, exceptedBlock);
  });

  it('Test de generateBlock pour un change input numeric', () => {
    // Attributs utilisé pour générer le block
    const eventModel = {
      selector,
      value,
      selectorFocus: '#input',
      action : actionEvents.CHANGE_INPUTNUMERIC
    };

    assert.deepStrictEqual(
      ChangeBlockFactory.generateBlock(
      eventModel,
      ChangeBlockFactory.frameId,
      ChangeBlockFactory.frame,
      defaults
      ),
      ChangeBlockFactory.buildChangeInputNumeric(
        selector,
        value,
        '#input'
      )
    );
  });

  it('Test de generateBlock pour un change simple', () => {
    // Attributs utilisé pour générer le block
    const eventModel = {
      selector,
      value,
      action : actionEvents.CHANGE
    };

    assert.deepStrictEqual(
      ChangeBlockFactory.generateBlock(
      eventModel,
      ChangeBlockFactory.frameId,
      ChangeBlockFactory.frame,
      defaults
      ),
      ChangeBlockFactory.buildChange(
        selector,
        value
      )
    );
  });

  it('Test de generateBlock pour un select change', () => {
    // Attributs utilisé pour générer le block
    const eventModel = {
      selector,
      value,
      action : actionEvents.CHANGE,
      tagName : elementsTagName.SELECT.toUpperCase()
    };

    assert.deepStrictEqual(
      ChangeBlockFactory.generateBlock(
      eventModel,
      ChangeBlockFactory.frameId,
      ChangeBlockFactory.frame,
      defaults
      ),
      ChangeBlockFactory.buildSelectChange(
        selector,
        value
      )
    );
  });


  it('Test de generateBlock pour un input file', () => {
    // Attributs utilisé pour générer le block
    const files = 'test.txt';
    const eventModel = {
      selector,
      value,
      action : actionEvents.CHANGE,
      files
    };

    assert.deepStrictEqual(
      ChangeBlockFactory.generateBlock(
      eventModel,
      ChangeBlockFactory.frameId,
      ChangeBlockFactory.frame,
      defaults
      ),
      ChangeBlockFactory.buildAcceptUploadFileChange(
        selector,
        files
      )
    );
  });
});