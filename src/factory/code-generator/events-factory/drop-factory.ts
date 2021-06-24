import { ChangeFactory } from './change-factory';
import { ClickFactory } from './click-factory';
import { Block } from 'code-generator/block';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';

// Constant
import CUSTOM_EVENTS from '../../../constants/events/events-custom';

/**
 * Factory qui permet de créér des objets liés à l'event drop
 */
export class DropFactory {

  /** Génère un block de code correpondant à l'évènement drop */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, selector, files} = event;

    // Si l'action est un drop sur un file dropzone
    if (action === CUSTOM_EVENTS.DROP_FILE) {

      // On rajoute d'abord la partie du click du file dropzone
      const newBlock = ClickFactory.buildFileDropZoneClickBlock(options, frameId, frame, selector);

      // On rajoute la partie acceptation du fichier
      const chooserFile = ChangeFactory.buildAcceptUploadFileChangeBlock(frameId, files);

      for (let i = 0; i < chooserFile.getLines().length; i++ ) {
        newBlock.addLine(chooserFile.getLines()[i]);
      }

      return newBlock;
    }
  }
}