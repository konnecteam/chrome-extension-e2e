import { IOption } from './../../../interfaces/i-options';
import { ILineBlock } from '../../../interfaces/i-line-block';
import { Block } from '../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import domEventsToRecord from '../../../constants/events/events-dom';
import customEvents from '../../../constants/events/events-custom';
import { ClickFactory } from './click-factory';
import eventsDom from '../../../constants/events/events-dom';

/**
 * Attributs d'un IMessage
 */
const selector = '#id';
const value = 'testValue';
const time = 1500;
const scrollElement = '#idSrollElement';
const scrollXElement = 500;
const scrollYElement = 250;
/** frame et options utilisées pour les tests */
let frame : string;
let frameId : number;
let options : IOption;

/**
 * Génère le line block d'un click
 */
function simpleClickLineBlock() : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
    value: `await ${frame}.$eval('${selector}',  el=> el.click());`
  };
}

/**
 * Génère le line block d'un click sur une dropzone
 */
function clickFileDropZoneLineModel() : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
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
    type: domEventsToRecord.CLICK,
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
    type: domEventsToRecord.CLICK,
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
    type : domEventsToRecord.CLICK,
    value : options.customLineAfterClick
  };
}

/**
 * Génère la ligne customisé avant chaque event
 * @param select
 */
function customLineBeforeEvent(event : string) : ILineBlock {
  return {
    type : event,
    value : options.customLinesBeforeEvent
  };
}
/**
 * Génère le line block d'un waitForSelector
 */

function waitForSelectorOnClickLineBlock(select : string) : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
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
    type: domEventsToRecord.CLICK,
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
    type: domEventsToRecord.CLICK,
    value: `await ${frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        e.click();
      });`
  };
}

// tslint:disable-next-line: no-big-function
describe('Test de Click Block Factory', () => {

  // tslint:disable-next-line: no-big-function
  describe('Test des buiders', () => {

    // Initialisation des attributs de classe
    beforeAll(() => {

      frame = 'page';
      frameId = 0;
      options =  JSON.parse(JSON.stringify(defaults));
    });

    test('Test d\'un simple click avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickFactory.buildBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un simple click sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);

      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickFactory.buildBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );


    });

    test('Test d\'un simple click avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click in file dropzone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickFactory.buildclickFileDropZoneBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);
      // Click in file dropzone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickFactory.buildclickFileDropZoneBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(
          options,
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
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(
          options,
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
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());
      // cutom line
      exceptedBlock.addLine({
        type : domEventsToRecord.CLICK,
        value : options.customLineAfterClick
      });

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(
          options,
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
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickFactory.buildClickMouseBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(frameId);

      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickFactory.buildClickMouseBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildClickMouseBlock(
          options,
          frameId,
          frame,
          selector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un click list item avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickScrollElementLineBlock());
      // Click list item
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());

      expect(
        ClickFactory.buildClickKListItemBlock(
          options,
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
      options.waitForSelectorOnClick = false;
      const exceptedBlock = new Block(frameId);

      // Click item konnect liste teste
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());


      expect(
        ClickFactory.buildClickKListItemBlock(
          options,
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
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickScrollElementLineBlock());

      // Click item k list teste
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildClickKListItemBlock(
          options,
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


    test('Test de generateBlock pour un simple click', () => {
      const eventI = {
        selector,
        action : eventsDom.CLICK,
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          frameId,
          frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildBlock(
          defaults,
          frameId,
          frame,
          selector
        )
      );
    });

    test('Test de generateBlock pour un click sur un file drop zone', () => {
      const eventI = {
        selector,
        action : customEvents.CLICK_DROPZONE
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          frameId,
          frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildclickFileDropZoneBlock(
          options,
          frameId,
          frame,
          selector
        )
      );
    });


    test('Test de generateBlock pour un click sur les flêches d\'un input numeric', () => {
      const eventI = {
        selector,
        durancyClick : time,
        action : customEvents.CLICK_MOUSE_INPUT_NUMERIC
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          frameId,
          frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildClickMouseInputNumericBlock(
          defaults,
          frameId,
          frame,
          selector,
          time
        )
      );
    });

    test('Test de generateBlock pour un click mouse', () => {
      const eventI = {
        selector,
        action : customEvents.CLICK_MOUSE
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          frameId,
          frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildClickMouseBlock(
          defaults,
          frameId,
          frame,
          selector
        )
      );
    });

    test('Test de generateBlock pour une liste à choix multiples', () => {
      const eventI = {
        selector,
        scrollElement,
        scrollXElement,
        scrollYElement,
        action : customEvents.CLICK_LIST_ITEM
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          frameId,
          frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildClickKListItemBlock(
          defaults,
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