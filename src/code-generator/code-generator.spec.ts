import { ScenarioFactory } from '../factory/code-generator/scenario-factory';
import { IOption } from '../interfaces/i-options';
import { IMessage } from '../interfaces/i-message';
import { Block } from './block';
import 'jest';
import CodeGenerator from './code-generator';
import { ScenarioService } from '../services/scenario/scenario-service';

// Constant
import PPTR_ACTIONS from '../constants/pptr-actions';
import DOM_EVENT from '../constants/events/events-dom';

/** Frame dans laquelle on se situe */
const frameId = 0;

/** Le tableau qui va contenir les events à parser */
let messageList : IMessage[] = [];

/** Nom de la frame */
const frame = 'page';

/**
 * Sauvegarde les options par défauts
 * car elles vont être modifiés
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

/**
 * Transforme une liste de Block en string
 */
function blocksToString(listBlock : Block[], wrapAsync : boolean) {
  const indent = wrapAsync ? '  ' : '';
  const newLine = `\n`;
  let result = '';
  for (let i = 0 ; i < listBlock.length; i++) {
    const lines = listBlock[i].getLines();
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      result += indent + line.value + newLine;
    }
  }
  return result;
}

/**
 * Créer un scénario à partir des options
 */
function createScenario(options : IOption) {
  // Header du scénario

  let scenarioExcepted = ScenarioFactory.buildHeader(
    options.recordHttpRequest,
    options.wrapAsync,
    options.headless,
    options.regexHTTPrequest
  );

  const listBlock = [];
  // Scénario
  for (let i = 0; i < messageList.length; i++) {
    const currentEvent = messageList[i];

    const block = ScenarioFactory.buildBlock(
      currentEvent,
      frameId,
      frame,
      options
    );

    if (block) {

      if (options.customLinesBeforeEvent && Object.values(PPTR_ACTIONS).indexOf(currentEvent.action) === -1) {
        listBlock.push(ScenarioFactory.buildCustomLineBlock(frameId, options.customLinesBeforeEvent));
      }

      if (currentEvent.comments) {
        listBlock.push(ScenarioFactory.buildCommentBlock(block, currentEvent.comments));
      } else {
        listBlock.push(block);
      }
    }
  }
  if (options.customLinesBeforeEvent) {

    listBlock.push(ScenarioFactory.buildCustomLineBlock(frameId, options.customLinesBeforeEvent));
  }

  // Insertion des lignes vide entre deux Block
  if (options.blankLinesBetweenBlocks && listBlock.length > 0) {
    let i = 0;
    while (i <= listBlock.length) {

      const blankLine = ScenarioFactory.buildBlankLineBlock();
      listBlock.splice(i, 0, blankLine);
      i += 2;
    }
  }
  // Passage des Block en string
  scenarioExcepted = `${scenarioExcepted}${blocksToString(listBlock, options.wrapAsync)}`;
  // Footer du scénario
  scenarioExcepted = `${scenarioExcepted}${ScenarioService.getFooter(options.wrapAsync)}`;
  return scenarioExcepted;
}

describe('Test de Code Generator', () => {

  beforeAll(() => {
    // On créé la liste des events enregistrés pour le scénario
    messageList.push(
      { typeEvent : PPTR_ACTIONS.PPTR , action : PPTR_ACTIONS.GOTO, value : 'localhost' }
    );

    messageList.push(
      { typeEvent : DOM_EVENT.CLICK, action : DOM_EVENT.CLICK, selector : '#idInput' }
    );

    messageList.push(
      { typeEvent : DOM_EVENT.CHANGE, action : DOM_EVENT.CHANGE, selector : '#idInput', value : 'change de value input' }
    );
  });

  test('Test avec les options par défauts', () => {

    expect(
      new CodeGenerator(defaultOptions).generate(messageList))
      .toEqual(
      createScenario(defaultOptions)
    );
  });

  test('Test avec les options de base et la custom ligne après chaque click', () => {

    const options = JSON.parse(JSON.stringify(defaultOptions));
    options.customLineAfterClick = 'ligne custom 2';

    expect(
      new CodeGenerator(options).generate(messageList))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec les options de  base et la custom ligne après chaque event', () => {

    const options = JSON.parse(JSON.stringify(defaultOptions));
    options.customLinesBeforeEvent = 'line before event';
    expect(
      new CodeGenerator(options).generate(messageList))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec l\'option des requetes http activé', () => {

    const options = JSON.parse(JSON.stringify(defaultOptions));
    options.recordHttpRequest = true;
    expect(
      new CodeGenerator(options).generate(messageList))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec l\'option des requetes http desactivé', () => {

    const options = JSON.parse(JSON.stringify(defaultOptions));
    options.recordHttpRequest = false;
    expect(
      new CodeGenerator(options).generate(messageList))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec le scénario dans une fonction async', () => {

    const options = JSON.parse(JSON.stringify(defaultOptions));
    options.wrapAsync = true;
    expect(
      new CodeGenerator(options).generate(messageList))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec le scénario en dehors de la fonction async', () => {

    const options = JSON.parse(JSON.stringify(defaultOptions));
    options.wrapAsync = false;
    expect(
      new CodeGenerator(options).generate(messageList))
      .toEqual(
      createScenario(options)
    );
  });

  test('Test avec un event', () => {

    // On garde que le premier event
    messageList = messageList.splice(0, 1);

    expect(
      new CodeGenerator(defaultOptions).generate(messageList))
      .toEqual(
      createScenario(defaultOptions)
    );
  });

  test('Test avec une liste d\'event vide', () => {

    messageList = [];
    expect(
      new CodeGenerator(defaultOptions).generate(messageList))
      .toEqual(
      createScenario(defaultOptions)
    );
  });

});