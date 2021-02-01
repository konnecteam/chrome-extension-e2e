import { LineBlockModel } from './../../../models/line-block-model';
import { Block } from './../../../code-generator/block';
import { defaults } from '../../../constants/default-options';
import 'jest';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import actionEvents from '../../../constants/action-events';
import elementsTagName from '../../../constants/elements-tagName';
import { ClickBlockFactory } from './click-block-factory';

/**
 * Attributs d'un EventModel
 */
const selector = '#id';
const value = 'testValue';
const time = 1500;
const options = JSON.parse(JSON.stringify(defaults));
const scrollElement = '#idSrollElement';
const scrollXElement = 500;
const scrollYElement = 250;
const dateSelector = '#idDate';
const calendarHeaderSelector = '#idHeader';
const calendarViewSelector =  '#idView';

/**
 * Génère le line block d'un click
 */
function simpleClickLineBlock() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: `await ${ClickBlockFactory.frame}.$eval('${selector}',  el=> el.click());`
  };
}

/**
 * Génère le line block d'un click sur une drop zone
 */
function clickFileDropZoneLineModel() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: `  [fileChooser] = await Promise.all([
      ${ClickBlockFactory.frame}.waitForFileChooser(),
      ${ClickBlockFactory.frame}.waitForSelector('${selector}'),
      ${ClickBlockFactory.frame}.$eval('${selector}',  el=> el.click())
    ]);`
  };
}

/**
 * Génère le line block d'un click sur une flêche de l'input numeric
 */
function clickMouseInputNumericLineModel() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: ` await ${ClickBlockFactory.frame}.evaluate( async function(){
      let e = document.querySelector('${selector}');
      var clickEvent = document.createEvent ('MouseEvents');
      clickEvent.initEvent ('mousedown', true, true);
      e.dispatchEvent (clickEvent);
      await new Promise(resolve => setTimeout(resolve, ${time}));
      clickEvent.initEvent ('mouseup', true, true);
      e.dispatchEvent (clickEvent);
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
function clickMouseLineModel() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: ` await ${ClickBlockFactory.frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent ('mousedown', true, true);
        e.dispatchEvent (clickEvent);
        clickEvent.initEvent ('mouseup', true, true);
        e.dispatchEvent (clickEvent);
        return Promise.resolve('finish');
      });`
  };
}

/**
 * Génère le line block de la customLine
 */
function customeLineLineBlock() : LineBlockModel {
  return {
    type : domEventsToRecord.CLICK,
    value : options.customLineAfterClick
  };
}

/**
 * Génère la ligne customisé avant chaques event
 * @param select
 */
function customLineBeforeEvent(event : string) : LineBlockModel {
  return {
    type : event,
    value : options.customLinesBeforeEvent
  };
}
/**
 * Génère le line block d'un waitForSelector
 */

function waitForSelectorOnClickLineBlock(select : string) : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: `await ${ClickBlockFactory.frame}.waitForSelector('${select}');`
  };
}

function waitForSelectorOnClickSelectorLineBlock() : LineBlockModel {
  return waitForSelectorOnClickLineBlock(selector);
}

/**
 * Génère le line block d'un waitForSelector sur scrollElement
 */
function waitForSelectorOnClickScrollElementLineBlock() : LineBlockModel {
  return waitForSelectorOnClickLineBlock(scrollElement);
}

/**
 * scroll pour le click sur un k list k list
 */
function scrollInKListItemLineBlock() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: ` await ${ClickBlockFactory.frame}.evaluate( async function(){
        let e = document.querySelector('${scrollElement}').parentElement;
        e.scroll(${scrollXElement}, ${scrollYElement});
        return Promise.resolve('finish');
      });`
  };
}

/**
 * Click sur l'item de une k list
 */
function clickKListItemLineBlock() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: `await ${ClickBlockFactory.frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        e.click();
        return Promise.resolve('finish');
      });`
  };
}

/**
 * Click sur l'élément date
 */
function clickInDateElementLineBlock() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: ` await ${ClickBlockFactory.frame}.evaluate( async function(){
      document.querySelector('${dateSelector}').au.date.viewModel.min = null;
      document.querySelector('${dateSelector}').au.date.viewModel.max = null;
      document.querySelector('${selector}').click();
      return Promise.resolve('finish');
    });`
  };
}

/** click sur un input date */
function clickInInputCalendarLineModel() : LineBlockModel {
  return {
    type: domEventsToRecord.CLICK,
    value: ` await ${ClickBlockFactory.frame}.evaluate( async function() {
      let calendarHeader = document.querySelector('${calendarHeaderSelector}');
      let calendarView = document.querySelector('${calendarViewSelector}');
      let valueSelected = document.querySelector('td[aria-selected=true]');

      if(valueSelected) {

        let currentValue = valueSelected.querySelector('a').getAttribute('data-value').split('/');
        let currentDate = new Date(currentValue[0], currentValue[1], currentValue[2]);
        let ourValue = '${value}'.split('/');
        let ourDate = new Date(ourValue[0],ourValue[1], ourValue[2]);

        if (calendarView.querySelector('a[data-value="${value}"]')) {
          calendarView.querySelector('a[data-value="${value}"]').click();
        }

        let changePage = '';
        if(currentDate > ourDate) {
          changePage = 'Previous';
        }
        if(currentDate < ourDate) {
          changePage = 'Next';
        }

        if(changePage !== '') {

          let buttonChangePage = calendarHeader.querySelector('a[aria-label=\'+changePage+\']');

          while(buttonChangePage && buttonChangePage.getAttribute('aria-disabled') === 'false'
            && !calendarView.querySelector('a[data-value="${value}"]')) {

            buttonChangePage.click();
          }
        }

        if (calendarView.querySelector('a[data-value="${value}"]')) {
          calendarView.querySelector('a[data-value="${value}"]').click();
        }
      }

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

      ClickBlockFactory.frame = 'page';
      ClickBlockFactory.frameId = 0;
      ClickBlockFactory.options = options;
    });

    test('Test d\'un simple click avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickBlockFactory.buildClick(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un simple click sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // Click
      exceptedBlock.addLine(simpleClickLineBlock());

      expect(
        ClickBlockFactory.buildClick(selector)
      ).toEqual(
        exceptedBlock
      );


    });

    test('Test d\'un simple click avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click
      exceptedBlock.addLine(simpleClickLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickBlockFactory.buildClick(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click in file drop zone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickBlockFactory.buildclickFileDropZone(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickFileDropZone sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickBlockFactory.frameId);
      // Click in file drop zone
      exceptedBlock.addLine(clickFileDropZoneLineModel());
      expect(
        ClickBlockFactory.buildclickFileDropZone(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickBlockFactory.buildClickMouseInputNumeric(selector, time)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // Click Mouse input numeric
      exceptedBlock.addLine(clickMouseInputNumericLineModel());

      expect(
        ClickBlockFactory.buildClickMouseInputNumeric(selector, time)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouseInputNumeric avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

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
        ClickBlockFactory.buildClickMouseInputNumeric(selector, time)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickBlockFactory.buildClickMouse(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());

      expect(
        ClickBlockFactory.buildClickMouse(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickMouse avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click Mouse
      exceptedBlock.addLine(clickMouseLineModel());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickBlockFactory.buildClickMouse(selector)
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un click list item avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickScrollElementLineBlock());
      // Click list item
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());

      expect(
        ClickBlockFactory.buildClickKListItem(
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
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // Click item k list teste
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());


      expect(
        ClickBlockFactory.buildClickKListItem(
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
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickScrollElementLineBlock());

      // Click item k list teste
      exceptedBlock.addLine(scrollInKListItemLineBlock());
      exceptedBlock.addLine(customLineBeforeEvent(domEventsToRecord.CLICK));
      exceptedBlock.addLine(clickKListItemLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickBlockFactory.buildClickKListItem(
          selector,
          scrollElement,
          scrollXElement,
          scrollYElement
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickInDateElement avec option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click date element
      exceptedBlock.addLine(clickInDateElementLineBlock());

      expect(
        ClickBlockFactory.buildClickInDateElement(
          selector,
          dateSelector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickInDateElement sans option waitForSelectorOnClick' , () => {
      options.waitForSelectorOnClick = false;

      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // Click date element
      exceptedBlock.addLine(clickInDateElementLineBlock());

      expect(
        ClickBlockFactory.buildClickInDateElement(
          selector,
          dateSelector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un ClickInDateElement avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // waitForSelector
      exceptedBlock.addLine(waitForSelectorOnClickSelectorLineBlock());
      // Click date element
      exceptedBlock.addLine(clickInDateElementLineBlock());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickBlockFactory.buildClickInDateElement(
          selector,
          dateSelector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickInInputCalendar' , () => {
      options.customLineAfterClick = '';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);
      // Click date element
      exceptedBlock.addLine(clickInInputCalendarLineModel());

      expect(
        ClickBlockFactory.buildClickInInputCalendar(
          selector,
          value,
          calendarHeaderSelector,
          calendarViewSelector
        )
      ).toEqual(
        exceptedBlock
      );
    });

    test('Test d\'un clickInInputCalendar avec option waitForSelectorOnClick et customLineAfterClick ' , () => {
      options.waitForSelectorOnClick = true;
      options.customLineAfterClick = 'ligne custom';
      const exceptedBlock = new Block(ClickBlockFactory.frameId);

      // Click date element
      exceptedBlock.addLine(clickInInputCalendarLineModel());
      // Custom line
      exceptedBlock.addLine(customeLineLineBlock());

      expect(
        ClickBlockFactory.buildClickInInputCalendar(
          selector,
          value,
          calendarHeaderSelector,
          calendarViewSelector
        )
      ).toEqual(
        exceptedBlock
      );
    });
  });

  describe('Test de generate', () => {


    test('Test de generateBlock pour un simple click', () => {
      const eventModel = {
        selector,
        action : actionEvents.BASIC_CLICK,
      };

      expect(
        ClickBlockFactory.generateBlock(
          eventModel,
          ClickBlockFactory.frameId,
          ClickBlockFactory.frame,
          defaults
        )
      ).toEqual(
        ClickBlockFactory.buildClick(
          selector
        )
      );
    });

    test('Test de generateBlock pour un click sur un file drop zone', () => {
      const eventModel = {
        selector,
        action : actionEvents.CLICK_DROPZONE
      };

      expect(
        ClickBlockFactory.generateBlock(
          eventModel,
          ClickBlockFactory.frameId,
          ClickBlockFactory.frame,
          defaults
        )
      ).toEqual(
        ClickBlockFactory.buildclickFileDropZone(
          selector
        )
      );
    });


    test('Test de generateBlock pour un click sur les flêches d\'un input numeric', () => {
      const eventModel = {
        selector,
        durancyClick : time,
        action : actionEvents.CLICKMOUSE_INPUTNUMERIC
      };

      expect(
        ClickBlockFactory.generateBlock(
          eventModel,
          ClickBlockFactory.frameId,
          ClickBlockFactory.frame,
          defaults
        )
      ).toEqual(
        ClickBlockFactory.buildClickMouseInputNumeric(
          selector,
          time
        )
      );
    });

    test('Test de generateBlock pour un click mouse', () => {
      const eventModel = {
        selector,
        action : actionEvents.CLICKMOUSE
      };

      expect(
        ClickBlockFactory.generateBlock(
          eventModel,
          ClickBlockFactory.frameId,
          ClickBlockFactory.frame,
          defaults
        )
      ).toEqual(
        ClickBlockFactory.buildClickMouse(
          selector
        )
      );
    });

    test('Test de generateBlock pour une liste à choix multiples', () => {
      const eventModel = {
        selector,
        scrollElement,
        scrollXElement,
        scrollYElement,
        action : actionEvents.CLICK_ITEMLIST
      };

      expect(
        ClickBlockFactory.generateBlock(
          eventModel,
          ClickBlockFactory.frameId,
          ClickBlockFactory.frame,
          defaults
        )
      ).toEqual(
        ClickBlockFactory.buildClickKListItem(
          selector,
          scrollElement,
          scrollXElement,
          scrollYElement
        )
      );
    });

    test('Test de generateBlock pour un click sur un input calendar ', () => {
      const eventModel = {
        selector,
        value,
        calendarHeader : calendarHeaderSelector,
        calendarView : calendarViewSelector,
        action : actionEvents.CLICK_INPUT_CALENDAR
      };

      expect(
        ClickBlockFactory.generateBlock(
          eventModel,
          ClickBlockFactory.frameId,
          ClickBlockFactory.frame,
          defaults
        )
      ).toEqual(
        ClickBlockFactory.buildClickInInputCalendar(
          selector,
          value,
          calendarHeaderSelector,
          calendarViewSelector
        )
      );
    });

    test('Test de generateBlock pour un click sur un date element ', () => {
      const eventModel = {
        selector,
        dateSelector,
        action : actionEvents.CLICK_DATE_ELEMENT
      };

      expect(
        ClickBlockFactory.generateBlock(
          eventModel,
          ClickBlockFactory.frameId,
          ClickBlockFactory.frame,
          defaults
        )
      ).toEqual(
        ClickBlockFactory.buildClickInDateElement(
          selector,
          dateSelector
        )
      );
    });
  });

});