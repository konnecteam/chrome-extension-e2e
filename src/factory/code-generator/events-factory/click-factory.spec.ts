import { IOption } from './../../../interfaces/i-options';
import { ILineBlock } from '../../../interfaces/i-line-block';
import { Block } from '../../../code-generator/block';
import 'jest';
import { ClickFactory } from './click-factory';

// Constant
import DOM_EVENT from '../../../constants/events/events-dom';
import CUSTOM_EVENT from '../../../constants/events/events-custom';

/**
 * Attributs d'un IMessage
 */
const selector = '#id';
const value = 'testValue';
const time = 1500;
const scrollElement = '#idSrollElement';
const scrollXElement = 500;
const scrollYElement = 250;
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

/**
 * Génère le line block d'un click
 */
function simpleClickLineBlock() : ILineBlock {
  return {
    type: DOM_EVENT.CLICK,
    value: `await ${frame}.$eval('${selector}',  el=> el.click());`
  };
}

/**
 * Génère le line block d'un click sur une dropzone
 */
function clickFileDropZoneLineModel() : ILineBlock {
  return {
    type: DOM_EVENT.CLICK,
    value: `  [fileChooser] = await Promise.all([
      ${frame}.waitForFileChooser(),
      ${frame}.waitForSelector('${selector}'),
      ${frame}.$eval('${selector}',  el=> el.click())
    ]);`
  };
}

/**
 * Génère le line block d'un click sur une flêche de l'input numeric
 */
function clickMouseInputNumericLineModel() : ILineBlock {
  return {
    type: DOM_EVENT.CLICK,
    value: ` await ${frame}.evaluate( async function(){
      let e = document.querySelector('${selector}');
      var docEvent = document.createEvent('MouseEvents');
      docEvent.initEvent('mousedown', true, true);
      e.dispatchEvent(docEvent);
      await new Promise(resolve => setTimeout(resolve, ${time}));
      docEvent.initEvent('mouseup', true, true);
      e.dispatchEvent(docEvent);
      // On blur les inputs qui sont dans l'élément numeric
      let list = e.parentNode.parentNode.parentNode.querySelectorAll('input');
      for(let i=0; i< list.length ;i++) {
        list[i].blur();
      }
    });`
  };
}

/**
 * Génère le line block d'un click mouse
 */
function clickMouseLineModel() : ILineBlock {
  return {
    type: DOM_EVENT.CLICK,
    value: ` await ${frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        var docEvent = document.createEvent('MouseEvents');
        docEvent.initEvent('mousedown', true, true);
        e.dispatchEvent(docEvent);
        docEvent.initEvent('mouseup', true, true);
        e.dispatchEvent(docEvent);
      });`
  };
}

/**
 * Génère le line block de la customLine
 */
function customeLineLineBlock() : ILineBlock {
  return {
    type : DOM_EVENT.CLICK,
    value : defaultOptions.customLineAfterClick
  };
}

/**
 * Génère la ligne customisé avant chaque event
 * @param select
 */
function customLineBeforeEvent(event : string) : ILineBlock {
  return {
    type : event,
    value : defaultOptions.customLinesBeforeEvent
  };
}
/**
 * Génère le line block d'un waitForSelector
 */

function waitForSelectorOnClickLineBlock(select : string) : ILineBlock {
  return {
    type: DOM_EVENT.CLICK,
    value: `await ${frame}.waitForSelector('${select}');`
  };
}

function waitForSelectorOnClickSelectorLineBlock() : ILineBlock {
  return waitForSelectorOnClickLineBlock(selector);
}

/**
 * Génère le line block d'un waitForSelector sur scrollElement
 */
function waitForSelectorOnClickScrollElementLineBlock() : ILineBlock {
  return waitForSelectorOnClickLineBlock(scrollElement);
}

/**
 * scroll pour le click sur un konnect liste
 */
function scrollInKListItemLineBlock() : ILineBlock {
  return {
    type: DOM_EVENT.CLICK,
    value: ` await ${frame}.evaluate( async function(){
        let e = document.querySelector('${scrollElement}').parentElement;
        e.scroll(${scrollXElement}, ${scrollYElement});
      });`
  };
}

/**
 * Click sur l'item de konnect liste
 */
function clickKListItemLineBlock() : ILineBlock {
  return {
    type: DOM_EVENT.CLICK,
    value: `await ${frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        e.click();
      });`
  };
}

// tslint:disable-next-line: no-big-function
describe('Test de Click Block Factory', () => {

  // tslint:disable-next-line: no-big-function
  describe('Test des builds', () => {

    // Initialisation des attributs de classe
    beforeAll(() => {

      frame = 'page';
      frameId = 0;
    });

    test('Test d\'un simple click avec option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickFactory.buildSimpleClickBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un simple click sans option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);

      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickFactory.buildSimpleClickBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );


    });

    test('Test d\'un simple click avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildSimpleClickBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone avec option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click in file dropzone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickFactory.buildFileDropZoneClickBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone sans option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);
      // Click in file dropzone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickFactory.buildFileDropZoneClickBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric avec option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          time
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric sans option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          time
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());
      // cutom line
      exceptedBlock.addLine({
        type : DOM_EVENT.CLICK,
        value : defaultOptions.customLineAfterClick
      });

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          time
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse avec option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickFactory.buildClickMouseBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse sans option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);

      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickFactory.buildClickMouseBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildClickMouseBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un click list item avec option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickScrollElementLineBlock());
      // Click list item
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(DOM_EVENT.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());

      expect(
        ClickFactory.buildClickKListItemBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          scrollElement,
          scrollXElement,
          scrollYElement
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un click list item sans option waitForSelectorOnClick' , () => {
      defaultOptions.waitForSelectorOnClick = false;
      const exceptedBlock = new Block(frameId);

      // Click item konnect liste teste
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(DOM_EVENT.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());


      expect(
        ClickFactory.buildClickKListItemBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          scrollElement,
          scrollXElement,
          scrollYElement
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMultiplekListItem avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      defaultOptions.waitForSelectorOnClick = true;
      defaultOptions.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickScrollElementLineBlock());

      // Click item k list teste
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(DOM_EVENT.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildClickKListItemBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          scrollElement,
          scrollXElement,
          scrollYElement
        )
      ).toEqual(
        exceptedBlock
      );
    });
  });

  describe('Test de generate', () => {


    test('Test de buildBlock pour un simple click', () => {
      const eventI = {
        selector,
        action : DOM_EVENT.CLICK,
      };

      expect(
        ClickFactory.buildBlock(
          eventI,
          frameId,
          frame,
          defaultOptions
        )
      ).toEqual(
        ClickFactory.buildSimpleClickBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      );
    });

    test('Test de buildBlock pour un click sur un file drop zone', () => {
      const eventI = {
        selector,
        action : CUSTOM_EVENT.CLICK_DROPZONE
      };

      expect(
        ClickFactory.buildBlock(
          eventI,
          frameId,
          frame,
          defaultOptions
        )
      ).toEqual(
        ClickFactory.buildFileDropZoneClickBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      );
    });


    test('Test de buildBlock pour un click sur les flêches d\'un input numeric', () => {
      const eventI = {
        selector,
        durancyClick : time,
        action : CUSTOM_EVENT.CLICK_MOUSE_INPUT_NUMERIC
      };

      expect(
        ClickFactory.buildBlock(
          eventI,
          frameId,
          frame,
          defaultOptions
        )
      ).toEqual(
        ClickFactory.buildClickMouseInputNumericBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          time
        )
      );
    });

    test('Test de buildBlock pour un click mouse', () => {
      const eventI = {
        selector,
        action : CUSTOM_EVENT.CLICK_MOUSE
      };

      expect(
        ClickFactory.buildBlock(
          eventI,
          frameId,
          frame,
          defaultOptions
        )
      ).toEqual(
        ClickFactory.buildClickMouseBlock(
          defaultOptions,
          frameId,
          frame,
          selector
        )
      );
    });

    test('Test de buildBlock pour une liste à choix multiples', () => {
      const eventI = {
        selector,
        scrollElement,
        scrollXElement,
        scrollYElement,
        action : CUSTOM_EVENT.CLICK_LIST_ITEM
      };

      expect(
        ClickFactory.buildBlock(
          eventI,
          frameId,
          frame,
          defaultOptions
        )
      ).toEqual(
        ClickFactory.buildClickKListItemBlock(
          defaultOptions,
          frameId,
          frame,
          selector,
          scrollElement,
          scrollXElement,
          scrollYElement
        )
      );
    });

  });
});