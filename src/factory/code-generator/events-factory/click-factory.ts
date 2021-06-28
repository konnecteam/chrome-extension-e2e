import { Block } from '../../../code-generator/block';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';

// Constant
import DOM_EVENT from '../../../constants/events/events-dom';
import CUSTOM_EVENT from '../../../constants/events/events-custom';

/**
 * Factory qui permet de créér des objets liés à l'event Click
 */
export class ClickFactory {

  /**
   * Génère un block de code à partir d'un IMessage
   */
  public static buildBlock(
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
      case DOM_EVENT.CLICK:
        return this.buildSimpleClickBlock(options, frameId, frame, selector);
      // Si c'est un click sur un dropzone element
      case CUSTOM_EVENT.CLICK_DROPZONE:
        return this.buildFileDropZoneClickBlock(options, frameId, frame, selector);
      // Si c'est un click sur les flêches de l'input numeric
      case CUSTOM_EVENT.CLICK_MOUSE_INPUT_NUMERIC:
        return this.buildClickMouseInputNumericBlock(options, frameId, frame, selector, durancyClick);
      // Si c'est un click mouse (mousdown, mouseup)
      case CUSTOM_EVENT.CLICK_MOUSE :
        return this.buildClickMouseBlock(options, frameId, frame, selector);
      // Si c'est un click sur une liste
      case CUSTOM_EVENT.CLICK_LIST_ITEM:
        return this.buildClickKListItemBlock(
          options, frameId, frame, selector, scrollElement, scrollXElement, scrollYElement
        );
      case CUSTOM_EVENT.CLICK_MOUSE_ENTER:
        return this.buildClickMouseEnter(options, frameId, frame, selector);
      default : return null;

    }
  }

  /**
   * On constuit un click qui va contenir un mouseenter
   */
  public static buildClickMouseEnter(options : IOption, frameId : number, frame : string, selector : string) : Block {

    const block = new Block(frameId);

    if (options.waitForSelectorOnClick) {

      block.addLine({
        type: DOM_EVENT.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: DOM_EVENT.CLICK,
      value: ` await ${frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        var docEvent = document.createEvent('MouseEvents');
        docEvent.initEvent('mouseenter', true, true);
        e.dispatchEvent(docEvent);
        e.click();
      });`
    });

    if (options.customLineAfterClick) {

      block.addLine({
        type: DOM_EVENT.CLICK,
        value: `${options.customLineAfterClick}`
      });
    }

    return block;
  }

/**
 * Génère un block de code correspondant à un simple click
 */
  public static buildSimpleClickBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string
  ) : Block {

    const block = new Block(frameId);

    if (options.waitForSelectorOnClick) {

      block.addLine({
        type: DOM_EVENT.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: DOM_EVENT.CLICK,
      value: `await ${frame}.$eval('${selector}',  el=> el.click());`
    });

    if (options.customLineAfterClick) {

      block.addLine({
        type: DOM_EVENT.CLICK,
        value: `${options.customLineAfterClick}`
      });
    }

    return block;
  }

/**
 * Génère un Click d'un file drop zone
 */
  public static buildFileDropZoneClickBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string
  ) : Block {

    const block = new Block(frameId);

    if (options.waitForSelectorOnClick) {

      block.addLine({
        type: DOM_EVENT.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: DOM_EVENT.CLICK,
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
        type: DOM_EVENT.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type : DOM_EVENT.CLICK,
      value : ` await ${frame}.evaluate( async function(){
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
        type: DOM_EVENT.CLICK,
        value: `${options.customLineAfterClick}`
      });
    }

    return block;
  }

  /**
   * Génère un click appuyé (mouse up / mouse down)
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
        type: DOM_EVENT.CLICK,
        value: `await ${frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: DOM_EVENT.CLICK,
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
        type: DOM_EVENT.CLICK,
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
        type : DOM_EVENT.CLICK,
        value : `await ${frame}.waitForSelector('${scrollElement}');`
      });
    }

    block.addLine({
      type : DOM_EVENT.CLICK,
      value : ` await ${frame}.evaluate( async function(){
        let e = document.querySelector('${scrollElement}').parentElement;
        e.scroll(${scrollXElement}, ${scrollYElement});
      });`
    });

    // Permet d'attendre que les items chargent
    if (options.customLinesBeforeEvent) {
      block.addLine({
        type: DOM_EVENT.CLICK,
        value: `${options.customLinesBeforeEvent}`
      });
    }

    block.addLine({
      type : DOM_EVENT.CLICK,
      value : `await ${frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        e.click();
      });`
    });

    if (options.customLineAfterClick) {

      block.addLine({
        type : DOM_EVENT.CLICK,
        value : `${options.customLineAfterClick}`
      });
    }
    return block;
  }
}