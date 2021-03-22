import { Block } from '../../../code-generator/block';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import ActionEvents from '../../../constants/action-events';
import domEventsToRecord from '../../../constants/dom-events-to-record';

/**
 * Factory qui permet de créér des objets liés à l'event keydown
 */
export class KeydownFactory {

  // les attributs sont utilisés pour éviter de les passer aux méthodes

    /** Options du plugin */
  public static options : IOption;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;

  /**
   * Génère un block de l'event keydown
   */
  public static generateBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {
    const { action, selector, value, iframe } = event;

    this.options = options;
    this.frameId = frameId;
    this.frame = frame;

    // Si c'est une action event de liste keydown
    if (action === ActionEvents.LISTKEYDOWN) {
      return this.buildListKeydown(selector, value, iframe);
    }
  }

  /**
   * Généré une liste keydown
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
          let element = iframeElement.contentDocument.querySelector('${selector}');
          element.className = '';
          element.innerHTML = \`${value}\`;
          var docEvent = document.createEvent('KeyboardEvents');
          docEvent.initEvent ('keyup', true, true);
          element.dispatchEvent (docEvent);
          return Promise.resolve('finish');
        });`
      });
    } else {

      block.addLine({
        type: 'KEYUP',
        value: ` await ${this.frame}.evaluate( async function(){
          let element = document.querySelector('${selector}');
          var docEvent = document.createEvent('KeyboardEvents');
          //If it isn't input element
          if(element.value == null){
            element.className = '';
            element.innerHTML = \`${value}\`;
            docEvent.initEvent ('keyup', true, true);
            element.dispatchEvent (docEvent);
          } else {
            element.value = \`${value}\`;
            docEvent.initEvent('keydown', true, true);
            element.dispatchEvent(docEvent);
          }
          return Promise.resolve('finish');
        });`
      });

    }
    return block;
  }

}