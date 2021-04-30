import { ClickFactory } from './click-factory';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import customEvents from '../../../constants/events/events-custom';
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

    const { action, tagName, submitterSelector} = event;

    // Si l'event est un submit
    if (action === customEvents.SUBMIT) {
      if (tagName === elementsTagName.FORM.toUpperCase()) {
        return this.buildSubmitBlock(frameId, frame, options, submitterSelector);
      }
    }
  }

  /**
   * Généré un submit
   */
  public static buildSubmitBlock(frameId : number, frame : string, options : IOption, selector : string) : Block {

    return ClickFactory.buildClickBlock(options, frameId, frame, selector);
  }

}