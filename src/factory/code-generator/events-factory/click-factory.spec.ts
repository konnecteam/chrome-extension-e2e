import { ILineBlock } from '../../../interfaces/i-line-block';
import { Block } from '../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import actionEvents from '../../../constants/action-events';
import { ClickFactory } from './click-factory';

/**
 * Attributs d'un IMessage
 */
const selector = '#id';
const value = 'testValue';
const time = 1500;
const options = JSON.parse(JSON.stringify(defaults));
const scrollElement = '#idSrollElement';
const scrollXElement = 500;
const scrollYElement = 250;

/**
 * Génère le line block d'un click
 */
function simpleClickLineBlock() : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
    value: `await ${ClickFactory.frame}.$eval('${selector}',  el=> el.click());`
  };
}

/**
 * Génère le line block d'un click sur une dropzone
 */
function clickFileDropZoneLineModel() : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
    value: `  [fileChooser] = await Promise.all([
      ${ClickFactory.frame}.waitForFileChooser(),
      ${ClickFactory.frame}.waitForSelector('${selector}'),
      ${ClickFactory.frame}.$eval('${selector}',  el=> el.click())
    ]);`
  };
}

/**
 * Génère le line block d'un click sur une flêche de l'input numeric
 */
function clickMouseInputNumericLineModel() : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
    value: ` await ${ClickFactory.frame}.evaluate( async function(){
      let e = document.querySelector('${selector}');
      var docEvent = document.createEvent ('MouseEvents');
      docEvent.initEvent ('mousedown', true, true);
      e.dispatchEvent (docEvent);
      await new Promise(resolve => setTimeout(resolve, ${time}));
      docEvent.initEvent ('mouseup', true, true);
      e.dispatchEvent (docEvent);
      // we go in parent that containes numeric input
      let list = e.parentNode.parentNode.parentNode.querySelectorAll('input');
      for(let i=0; i< list.length ;i++) {
        list[i].blur();
      }
      return Promise.resolve('finish');
    });`
  };
}

/**
 * Génère le line block d'un click mouse
 */
function clickMouseLineModel() : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
    value: ` await ${ClickFactory.frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        var docEvent = document.createEvent ('MouseEvents');
        docEvent.initEvent ('mousedown', true, true);
        e.dispatchEvent (docEvent);
        docEvent.initEvent ('mouseup', true, true);
        e.dispatchEvent (docEvent);
        return Promise.resolve('finish');
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
    value: `await ${ClickFactory.frame}.waitForSelector('${select}');`
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
    value: ` await ${ClickFactory.frame}.evaluate( async function(){
        let e = document.querySelector('${scrollElement}').parentElement;
        e.scroll(${scrollXElement}, ${scrollYElement});
        return Promise.resolve('finish');
      });`
  };
}

/**
 * Click sur l'item de konnect liste
 */
function clickKListItemLineBlock() : ILineBlock {
  return {
    type: domEventsToRecord.CLICK,
    value: `await ${ClickFactory.frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        e.click();
        return Promise.resolve('finish');
      });`
  };
}

// tslint:disable-next-line: no-big-function
describe('Test de Click Block Factory', () => {

  // tslint:disable-next-line: no-big-function
  describe('Test des buiders', () => {

    // Initialisation des attributs de classe
    beforeAll(() => {

      ClickFactory.frame = 'page';
      ClickFactory.frameId = 0;
      ClickFactory.options = options;
    });

    test('Test d\'un simple click avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickFactory.buildClickBlock(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un simple click sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickFactory.frameId);

      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickFactory.buildClickBlock(selector)
      ).toEqual(
        exceptedBlock
      );


    });

    test('Test d\'un simple click avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildClickBlock(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click in file dropzone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickFactory.buildclickFileDropZoneBlock(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickFactory.frameId);
      // Click in file dropzone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickFactory.buildclickFileDropZoneBlock(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(selector, time)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickFactory.frameId);

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickFactory.buildClickMouseInputNumericBlock(selector, time)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickFactory.frameId);

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
        ClickFactory.buildClickMouseInputNumericBlock(selector, time)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickFactory.buildClickMouseBlock(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickFactory.frameId);

      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickFactory.buildClickMouseBlock(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickFactory.buildClickMouseBlock(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un click list item avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickScrollElementLineBlock());
      // Click list item
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());

      expect(
        ClickFactory.buildClickKListItemBlock(
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
      const exceptedBlock = new Block(ClickFactory.frameId);

      // Click item konnect liste teste
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());


      expect(
        ClickFactory.buildClickKListItemBlock(
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
      const exceptedBlock = new Block(ClickFactory.frameId);

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
        action : actionEvents.BASIC_CLICK,
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          ClickFactory.frameId,
          ClickFactory.frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildClickBlock(
          selector
        )
      );
    });

    test('Test de generateBlock pour un click sur un file drop zone', () => {
      const eventI = {
        selector,
        action : actionEvents.CLICK_DROPZONE
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          ClickFactory.frameId,
          ClickFactory.frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildclickFileDropZoneBlock(
          selector
        )
      );
    });


    test('Test de generateBlock pour un click sur les flêches d\'un input numeric', () => {
      const eventI = {
        selector,
        durancyClick : time,
        action : actionEvents.CLICKMOUSE_INPUTNUMERIC
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          ClickFactory.frameId,
          ClickFactory.frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildClickMouseInputNumericBlock(
          selector,
          time
        )
      );
    });

    test('Test de generateBlock pour un click mouse', () => {
      const eventI = {
        selector,
        action : actionEvents.CLICKMOUSE
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          ClickFactory.frameId,
          ClickFactory.frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildClickMouseBlock(
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
        action : actionEvents.CLICK_ITEMLIST
      };

      expect(
        ClickFactory.generateBlock(
          eventI,
          ClickFactory.frameId,
          ClickFactory.frame,
          defaults
        )
      ).toEqual(
        ClickFactory.buildClickKListItemBlock(
          selector,
          scrollElement,
          scrollXElement,
          scrollYElement
        )
      );
    });

  });
});