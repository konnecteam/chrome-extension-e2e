import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import ActionEvents from '../../../constants/action-events';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import { Block } from '../../../code-generator/block';
import elementsTagName from '../../../constants/elements-tagName';

/**
 * Facotry qui permet de créér des objets liés au submit
 */
export class SubmitFactory {

  // les attributs sont utilisés pour éviter de les passer aux méthodes

  /** Options du plugin */
  public static options : IOption;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;

  /**
   * Génère un block lié à l'event submit
   */
  public static generateBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, tagName} = event;
    this.frameId = frameId;
    this.frame = frame;
    this.options = options;

    // Si l'event est un submit
    if (action === ActionEvents.SUBMIT) {
      if (tagName === elementsTagName.FORM.toUpperCase()) {
        return this.buildSubmitBlock();
      }
    }
  }

  /**
   * Généré un submit
   */
  public static buildSubmitBlock() : Block {

    const block = new Block(this.frameId);

    block.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${this.frame}.keyboard.press('Enter');`
    });
    return block;
  }

}