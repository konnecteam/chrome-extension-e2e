import { IMessage } from 'interfaces/i-message';
import { Block } from '../../../code-generator/block';
import domEventsToRecord from '../../../constants/events/events-dom';

/**
 * Factory qui permet de créér des objets liés au scroll
 */
export class ScrollFactory {

  /**
   * Génère le block de scroll associé au IMessage
   * @param event
   * @param frameId
   * @param frame
   * @returns
   */
  static generateBlock(event : IMessage, frameId : number, frame : string) : Block {
    const { action, selector, scrollX, scrollY } = event;

    // Si c'est une action event de scroll
    if (action === domEventsToRecord.SCROLL) {
      return this.buildScrollBlock(frame, frameId, selector, scrollX, scrollY);
    }
  }

  /**
   * Factory qui génère un scroll
   */
  public static buildScrollBlock(frame : string, frameId : number, selector : string, scrollX : number
    , scrollY : number) : Block {

    const block = new Block(frameId);

    /* Si le sélécteur n'est pas vide il contient le selecteur d'un element
     * Mais si il est vide c'est que c'est le scroll de la window
     */
    const element = selector ? `document.querySelector('${selector}')` : 'window';
    block.addLine({
      type: 'scroll',
      value: ` await ${frame}.evaluate( async function(){
        ${element}.scroll(${scrollX}, ${scrollY});
      });`
    });
    return block;
  }
}