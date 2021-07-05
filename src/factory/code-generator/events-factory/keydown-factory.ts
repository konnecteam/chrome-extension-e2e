import { Block } from '../../../code-generator/block';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import { ECustomEvent } from '../../../enum/events/events-custom';

// Constant
import { EDomEvent } from '../../../enum/events/events-dom';

/**
 * Factory qui permet de créér des objets liés à l'event keydown
 */
export class KeydownFactory {

  /**
   * Génère un block de l'event keydown
   */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, selector, value, iframe } = event;

    // Si c'est une action event de liste keydown
    if (action === ECustomEvent.LIST_KEYDOWN) {
      return this.buildListKeydownBlock(options, frameId, frame, selector, value, iframe);
    }
  }

  /**
   * Généré une liste keydown
   */
  public static buildListKeydownBlock(
    options : IOption,
    frameId : number,
    frame : string,
    selector : string,
    value : string,
    iframe : string
  ) : Block {
    const block = new Block(frameId);

    if (options.waitForSelectorOnClick) {
      block.addLine({
        type : EDomEvent.CLICK,
        value : ` await ${frame}.waitForSelector('${iframe ? iframe : selector}')`
      });
    }

    if (iframe) {

      block.addLine({
        type : EDomEvent.KEYDOWN,
        value : ` await ${frame}.evaluate( async function(){
          let iframeElement = document.querySelector('${iframe}');
          let element = iframeElement.contentDocument.querySelector('${selector}');
          element.className = '';
          element.innerHTML = \`${value}\`;
          var docEvent = document.createEvent('KeyboardEvents');
          docEvent.initEvent ('keyup', true, true);
          element.dispatchEvent (docEvent);
        });`
      });
    } else {

      block.addLine({
        type : 'KEYUP',
        value : ` await ${frame}.evaluate( async function(){
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
        });`
      });
    }

    return block;
  }
}