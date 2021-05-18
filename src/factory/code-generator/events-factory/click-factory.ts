import { Block } from '../../../code-generator/block';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import customEvents from '../../../constants/events/events-custom';
import domEventsToRecord from '../../../constants/events/events-dom';
import eventsDom from '../../../constants/events/events-dom';

/**
 * Factory qui permet de créér des objets liés à l'event Click
 */
export class ClickFactory {

  /**
   * Génère un block à partir d'un IMessage
   */
  public static generateBlock(
    event : IMessage,
    frameId : number,
    frame : string,
    options : IOption
  ) : Block {

    const { action, selector, durancyClick, scrollElement,
      scrollXElement, scrollYElement} = event;

    // En fonction de l'action détécté
    switch (action) {

      // Si c'est un click basique
      case eventsDom.CLICK:
        return this.buildBlock(options, frameId, frame, selector);
      // Si c'est un click sur un dropzone element
      case customEvents.CLICK_DROPZONE:
        return this.buildclickFileDropZoneBlock(options, frameId, frame, selector);
      // Si c'est un click sur les flêches de l'input numeric
      case customEvents.CLICK_MOUSE_INPUT_NUMERIC:
        return this.buildClickMouseInputNumericBlock(options, frameId, frame, selector, durancyClick);
      // Si c'est un click mouse (mousdown, mouseup)
      case customEvents.CLICK_MOUSE :
        return this.buildClickMouseBlock(options, frameId, frame, selector);
      // Si c'est un click sur une liste
      case customEvents.CLICK_LIST_ITEM:
        return this.buildClickKListItemBlock(
          options, frameId, frame, selector, scrollElement, scrollXElement, scrollYElement
        );
      default : return null;

    }
  }

/**
 * Génère le click d'un simple click
 */
  public static buildBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string
  ) : Block {

    const block = new Block(frameId);
    if (options.waitForSelectorOnClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }
    block.addLine({
      type: domEventsToRecord.CLICK,
      value: `await ${frame}.$eval('${selector}',  el=> el.click());`
    });

    if (options.customLineAfterClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${options.customLineAfterClick}`
      });
    }
    return block;
  }

/**
 * Génère un Click d'une file drop zone
 */
  public static buildclickFileDropZoneBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string
  ) : Block {

    const block = new Block(frameId);
    if (options.waitForSelectorOnClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: `  [fileChooser] = await Promise.all([
      ${frame}.waitForFileChooser(),
      ${frame}.waitForSelector('${selector}'),
      ${frame}.$eval('${selector}',  el=> el.click())
    ]);`
    });

    return block;
  }

/**
 * Génère un click appuyé du k select de l'input numeric
 */
  public static buildClickMouseInputNumericBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string, time : number
  ) : Block {

    const block = new Block(frameId);
    if (options.waitForSelectorOnClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
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
    });

    if (options.customLineAfterClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${options.customLineAfterClick}`
      });
    }

    return block;
  }
  /**
   * Génère un click appuyé
   */
  public static buildClickMouseBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string
  ) : Block {
    const block = new Block(frameId);
    if (options.waitForSelectorOnClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: ` await ${frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        var docEvent = document.createEvent('MouseEvents');
        docEvent.initEvent('mousedown', true, true);
        e.dispatchEvent(docEvent);
        docEvent.initEvent('mouseup', true, true);
        e.dispatchEvent(docEvent);
      });`
    });

    if (options.customLineAfterClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${options.customLineAfterClick}`
      });
    }
    return block;

  }

  /**
   * Click sur un item de konnect liste
   */
  public static buildClickKListItemBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string,
    scrollElement : string,
    scrollXElement : number,
    scrollYElement : number
  ) : Block {

    const block = new Block(frameId);

    if (options.waitForSelectorOnClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${frame}.waitForSelector('${scrollElement}');`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: ` await ${frame}.evaluate( async function(){
        let e = document.querySelector('${scrollElement}').parentElement;
        e.scroll(${scrollXElement}, ${scrollYElement});
      });`
    });

    // Permet d'attendre que les items chargent
    if (options.customLinesBeforeEvent) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${options.customLinesBeforeEvent}`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: `await ${frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        e.click();
      });`
    });

    if (options.customLineAfterClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${options.customLineAfterClick}`
      });
    }
    return block;
  }
}