import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import customEvents from '../../../constants/events/events-custom';
import domEventsToRecord from '../../../constants/events/events-dom';
import { Block } from '../../../code-generator/block';
import elementsTagName from '../../../constants/elements/tag-name';

/**
 * Facotry qui permet de créér des objets liés au submit
 */
export class SubmitFactory {

  /**
   * Génère un block lié à l'event submit
   */
  public static generateBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, tagName} = event;

    // Si l'event est un submit
    if (action === customEvents.SUBMIT) {
      if (tagName === elementsTagName.FORM.toUpperCase()) {
        return this.buildSubmitBlock(frameId, frame);
      }
    }
  }

  /**
   * Généré un submit
   */
  public static buildSubmitBlock(frameId : number, frame : string) : Block {

    const block = new Block(frameId);

    block.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${frame}.keyboard.press('Enter');`
    });
    return block;
  }

}