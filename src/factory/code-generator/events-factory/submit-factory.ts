import { ClickFactory } from './click-factory';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import { Block } from '../../../code-generator/block';

// Constant
import TAG_NAME from '../../../constants/elements/tag-name';
import CUSTOM_EVENT from '../../../constants/events/events-custom';

/**
 * Factory qui permet de créér des objets liés au submit
 */
export class SubmitFactory {

  /**
   * Génère un block lié à l'event submit
   */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, tagName, submitterSelector} = event;

    // Si l'event est un submit
    if (action === CUSTOM_EVENT.SUBMIT) {
      if (tagName === TAG_NAME.FORM.toUpperCase()) {
        return ClickFactory.buildSimpleClickBlock(options, frameId, frame, submitterSelector);
      }
    }
  }
}