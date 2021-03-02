import { Block } from '../../../code-generator/block';
import { EventModel } from '../../../models/event-model';
import { OptionModel } from '../../../models/options-model';
import ActionEvents from '../../../constants/action-events';
import domEventsToRecord from '../../../constants/dom-events-to-record';

/**
 * Factory qui génère les block liés à l'event Click
 */
export class ClickBlockFactory {

  // les attributs sont utilisés pour éviter de les passer aux méthodes

  /** Options du plugin */
  public static options : OptionModel;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;
  /**
   * Génère un block à partir d'un eventModel
   */
  public static generateBlock(
    event : EventModel,
    frameId : number,
    frame : string,
    options : OptionModel
  ) : Block {

    const { action, selector, durancyClick, scrollElement,
      scrollXElement, scrollYElement} = event;

    this.options = options;
    this.frameId = frameId;
    this.frame = frame;

    // En fonction de l'action détécté
    switch (action) {

      // Si c'est un click basique
      case ActionEvents.BASIC_CLICK:
        return this.buildClick(selector);
      // Si c'est un click sur un dropzone element
      case ActionEvents.CLICK_DROPZONE:
        return this.buildclickFileDropZone(selector);
      // Si c'est un click sur les flêches de l'input numeric
      case ActionEvents.CLICKMOUSE_INPUTNUMERIC:
        return this.buildClickMouseInputNumeric(selector, durancyClick);
      // Si c'est un click mouse (mousdown, mouseup)
      case ActionEvents.CLICKMOUSE :
        return this.buildClickMouse(selector);
      // Si c'est un click sur une liste
      case ActionEvents.CLICK_ITEMLIST:
        return this.buildClickKListItem(
          selector, scrollElement, scrollXElement, scrollYElement
        );
    }
  }

/**
 * Génère le click d'un simple click
 */
  public static buildClick(selector : string) : Block {

    const block = new Block(this.frameId);
    if (this.options.waitForSelectorOnClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${this.frame}.waitForSelector('${selector}');`
      });
    }
    block.addLine({
      type: domEventsToRecord.CLICK,
      value: `await ${this.frame}.$eval('${selector}',  el=> el.click());`
    });

    if (this.options.customLineAfterClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${this.options.customLineAfterClick}`
      });
    }
    return block;
  }

/**
 * Génère un Click d'une file drop zone
 */
  public static buildclickFileDropZone(
  selector : string) : Block {

    const block = new Block(this.frameId);
    if (this.options.waitForSelectorOnClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${this.frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: `  [fileChooser] = await Promise.all([
      ${this.frame}.waitForFileChooser(),
      ${this.frame}.waitForSelector('${selector}'),
      ${this.frame}.$eval('${selector}',  el=> el.click())
    ]);`
    });

    return block;
  }

/**
 * Génère un click appuyé du k select de l'input numeric
 */
  public static buildClickMouseInputNumeric(selector : string, time : number) : Block {

    const block = new Block(this.frameId);
    if (this.options.waitForSelectorOnClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${this.frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: ` await ${this.frame}.evaluate( async function(){
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
    });

    if (this.options.customLineAfterClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${this.options.customLineAfterClick}`
      });
    }

    return block;
  }
  /**
   * Génère un click appuyé
   */
  public static buildClickMouse(selector : string) : Block {
    const block = new Block(this.frameId);
    if (this.options.waitForSelectorOnClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${this.frame}.waitForSelector('${selector}');`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: ` await ${this.frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        var docEvent = document.createEvent ('MouseEvents');
        docEvent.initEvent ('mousedown', true, true);
        e.dispatchEvent (docEvent);
        docEvent.initEvent ('mouseup', true, true);
        e.dispatchEvent (docEvent);
        return Promise.resolve('finish');
      });`
    });

    if (this.options.customLineAfterClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${this.options.customLineAfterClick}`
      });
    }
    return block;

  }

  /**
   * Click sur un item de konnect liste
   */
  public static buildClickKListItem(
     selector : string, scrollElement : string, scrollXElement : number, scrollYElement : number) : Block {

    const block = new Block(this.frameId);

    if (this.options.waitForSelectorOnClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `await ${this.frame}.waitForSelector('${scrollElement}');`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: ` await ${this.frame}.evaluate( async function(){
        let e = document.querySelector('${scrollElement}').parentElement;
        e.scroll(${scrollXElement}, ${scrollYElement});
        return Promise.resolve('finish');
      });`
    });

    // Permet d'attendre que les items chargent
    if (this.options.customLinesBeforeEvent) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${this.options.customLinesBeforeEvent}`
      });
    }

    block.addLine({
      type: domEventsToRecord.CLICK,
      value: `await ${this.frame}.evaluate( async function(){
        let e = document.querySelector('${selector}');
        e.click();
        return Promise.resolve('finish');
      });`
    });

    if (this.options.customLineAfterClick) {

      block.addLine({
        type: domEventsToRecord.CLICK,
        value: `${this.options.customLineAfterClick}`
      });
    }
    return block;
  }
}