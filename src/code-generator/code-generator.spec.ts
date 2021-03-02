import { defaults } from './../constants/default-options';
import domEventsToRecord from '../constants/dom-events-to-record';
import { ScenarioFactory } from '../factory/code-generator/scenario-factory';
import { FooterFactory } from '../factory/code-generator/footer-factory';
import { HeaderFactory } from '../factory/code-generator/header-factory';
import { OptionModel } from '../models/options-model';
import  pptrActions  from '../constants/pptr-actions';
import  actionEvents from '../constants/action-events';
import { EventModel } from '../models/event-model';
import { Block } from './block';
import 'jest';
import CodeGenerator from './code-generator';
import { ObjectService } from '../services/object/object-service';

/** Frame dans laquelle on se situe */
const frameId = 0;

/** Le tableau qui va contenir les events à parser */
let listEventModel : EventModel[] = [];

/** Nom de la frame */
const frame = 'page';

/**
 * Sauvegarde les options par défauts
 * car elles vont être modifiés
 */
const optionsDefault = JSON.parse(JSON.stringify(defaults));

/**
 * Transforme une liste de Block en string
 * @param listBlock
 * @param wrapAsync
 */
function blocksToString(listBlock : Block[], wrapAsync : boolean) {
  const indent = wrapAsync ? '  ' : '';
  const newLine = `\n`;
  let result = '';
  for (const block of listBlock) {
    const lines = block.getLines();

    for (const line of lines) {
      result += indent + line.value + newLine;
    }
  }
  return result;
}

/**
 * Créer un scénario à partir des options
 * @param options
 */
function createScenario(options : OptionModel) {
  // Header du scénario
  let scenarioExcepted = HeaderFactory.getHeader(
    options.recordHttpRequest,
    options.wrapAsync,
    options.headless,
    options.regexHTTPrequest
  );

  const listBlock = [];
  // Scénario
  for (const currentEvent of listEventModel) {
    const block = ScenarioFactory.parseEvent(
      currentEvent,
      frameId,
      frame,
      options
    );

    if (block) {

      if (options.customLinesBeforeEvent && !ObjectService.isValueInObject(pptrActions, currentEvent.action)) {
        listBlock.push(ScenarioFactory.generateCustomLine(frameId, options.customLinesBeforeEvent));
      }

      if (currentEvent.comments) {
        listBlock.push(ScenarioFactory.generateComments(block, currentEvent.comments));
      } else {
        listBlock.push(block);
      }
    }
  }

  // Insertion des lignes vide entre deux Block
  if (options.blankLinesBetweenBlocks && listBlock.length > 0) {
    let i = 0;
    while (i <= listBlock.length) {

      const blankLine = ScenarioFactory.generateBlankLine();
      listBlock.splice(i, 0, blankLine);
      i += 2;
    }
  }
  // Passage des Block en string
  scenarioExcepted += blocksToString(listBlock, options.wrapAsync);
  // Footer du scénario
  scenarioExcepted += FooterFactory.generateFooter(options.wrapAsync);
  return scenarioExcepted;
}

describe('Test de Code Generator', () => {

  beforeAll(() => {
    // On créé la liste des events enregistrés pour le scénario
    listEventModel.push(
      {typeEvent: pptrActions.pptr , action: pptrActions.GOTO, value: 'localhost'}
    );

    listEventModel.push(
      {typeEvent: domEventsToRecord.CLICK, action: actionEvents.BASIC_CLICK, selector: '#idInput'}
    );

    listEventModel.push(
      {typeEvent: domEventsToRecord.CHANGE, action: actionEvents.CHANGE, selector: '#idInput', value: 'change de value input'}
    );
  });

  /**
   * On fait cela car dans code generator
   * On change les valeurs par défauts par celles passer en paramètres
   */
  afterAll(() => {
    Object.assign(defaults, optionsDefault);
  });

  test('Test avec les options par défauts', () => {

    expect(
      new CodeGenerator(optionsDefault).generate(listEventModel))
      .toEqual(
      createScenario(optionsDefault)
    );
  });

  test('Test avec les options de base et la custom ligne après chaque click', () => {

    const options = JSON.parse(JSON.stringify(optionsDefault));
    options.customLineAfterClick = 'ligne custom 2';

    expect(
      new CodeGenerator(options).generate(listEventModel))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec les options de  base et la custom ligne après chaque event', () => {

    const options = JSON.parse(JSON.stringify(optionsDefault));
    options.customLinesBeforeEvent = 'line before event';
    expect(
      new CodeGenerator(options).generate(listEventModel))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec l\'option des requetes http activé', () => {

    const options = JSON.parse(JSON.stringify(optionsDefault));
    options.recordHttpRequest = true;
    expect(
      new CodeGenerator(options).generate(listEventModel))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec l\'option des requetes http desactivé', () => {

    const options = JSON.parse(JSON.stringify(optionsDefault));
    options.recordHttpRequest = false;
    expect(
      new CodeGenerator(options).generate(listEventModel))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec le scénario dans une fonction async', () => {

    const options = JSON.parse(JSON.stringify(optionsDefault));
    options.wrapAsync = true;
    expect(
      new CodeGenerator(options).generate(listEventModel))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec le scénario en dehors de la fonction async', () => {

    const options = JSON.parse(JSON.stringify(optionsDefault));
    options.wrapAsync = false;
    expect(
      new CodeGenerator(options).generate(listEventModel))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec un event', () => {

    // On garde que le premier event
    listEventModel = listEventModel.splice(0, 1);

    expect(
      new CodeGenerator(optionsDefault).generate(listEventModel))
      .toEqual(
      createScenario(optionsDefault)
    );
  });

  test('Test avec une liste d\'event vide', () => {

    listEventModel = [];
    expect(
      new CodeGenerator(optionsDefault).generate(listEventModel))
      .toEqual(
      createScenario(optionsDefault)
    );
  });

});