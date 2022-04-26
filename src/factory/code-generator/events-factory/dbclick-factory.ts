import { EDomEvent } from './../../../enum/events/events-dom';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import { Block } from '../../../code-generator/block';

/**
 * Factory qui permet de créer des objets liés au double click
 */
export class DbClickFactory {

  /**
   * Génère le block lié à un double click
   */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, selector} = event;

    if (action === EDomEvent.DBLCLICK) {

      return this.buildDbClick(options, frameId, frame, selector);
    } else {
      return null;
    }
  }

  /**
   * On constuit un dbclick
   */
  public static buildDbClick(options : IOption, frameId : number, frame : string, selector : string) : Block {

    const block = new Block(frameId);

    if (selector.length > 0) {

      if (options.waitForSelectorOnClick) {

        block.addLine({
          type : EDomEvent.CLICK,
          value : `await ${frame}.waitForSelector('${selector}');`
        });
      }

      block.addLine({
        type : EDomEvent.DBLCLICK,
        value : ` await ${frame}.evaluate( async function(){
            let e = document.querySelector('${selector}');
            var docEvent = document.createEvent('MouseEvents');
            docEvent.initEvent('dblclick', true, true);
            e.dispatchEvent(docEvent);
            e.click();
          });`
      });
    }

    if (options.customLineAfterClick) {

      block.addLine({
        type : EDomEvent.CLICK,
        value : `${options.customLineAfterClick}`
      });
    }

    return block;
  }
}
