import { Block } from '../../../code-generator/block';
import { EventModel } from '../../../models/event-model';
import { OptionModel } from '../../../models/options-model';
import ActionEvents from '../../../constants/action-events';
import domEventsToRecord from '../../../constants/dom-events-to-record';

/**
 * Factory qui génère les block liés à l'event keydown
 */
export class KeydownBlockFactory {

  // les attributs sont utilisés pour éviter de les passer aux méthodes

    /** Options du plugin */
  public static options : OptionModel;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;

  /**
   * Génère un block de l'event keydown
   */
  public static generateBlock(event : EventModel, frameId : number, frame : string, options : OptionModel) : Block {
    const { action, selector, value, iframe } = event;

    this.options = options;
    this.frameId = frameId;
    this.frame = frame;

    // Si c'est une action event de list keydown
    if (action === ActionEvents.LISTKEYDOWN) {
      return this.buildListKeydown(selector, value, iframe);
    }
  }

  /**
   * Généré une list keydown
   */
  public static buildListKeydown(
    selector : string, value : string, iframe : string) : Block {

    const block = new Block(this.frameId);

    if (this.options.waitForSelectorOnClick) {
      block.addLine({
        type: domEventsToRecord.CLICK,
        value: ` await ${this.frame}.waitForSelector('${iframe ? iframe : selector}')`
      });
    }

    if (iframe) {

      block.addLine({

        type: domEventsToRecord.KEYDOWN,
        value: ` await ${this.frame}.evaluate( async function(){
          let iframeElement = document.querySelector('${iframe}');
          let element = iframeElement.contentDocument.querySelector('${selector}')
          element.innerHTML = \`${value}\`;
          var clickEvent = document.createEvent('KeyboardEvents');
          clickEvent.initEvent ('keyup', true, true);
          element.dispatchEvent (clickEvent);
          return Promise.resolve('finish');
        });`
      });
    } else {

      block.addLine({
        type: 'KEYUP',
        value: ` await ${this.frame}.evaluate( async function(){
          let element = document.querySelector('${selector}');
          var clickEvent = document.createEvent('KeyboardEvents');
          //If it isn't input element
          if(element.value == null){
            element.innerHTML = \`${value}\`;
            clickEvent.initEvent ('keyup', true, true);
            element.dispatchEvent (clickEvent);
          } else {
            element.value = \`${value}\`;
            clickEvent.initEvent('keydown', true, true);
            element.dispatchEvent(clickEvent);
          }
          return Promise.resolve('finish');
        });`
      });

    }
    return block;
  }

}