import { ChangeFactory } from './change-factory';
import { ClickFactory } from './click-factory';
import { Block } from 'code-generator/block';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import customEvents from '../../../constants/events/events-custom';

/**
 * Factory qui permet de créér des objets liés à l'event drop
 */
export class DropFactory {

  public static generateBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {
    const { action, selector, files} = event;

    // Si l'action est un drop sur un file dropzone
    if (action === customEvents.DROP_FILE) {

      // On rajoute d'abord la partie du click du file dropzone
      const newBlock = ClickFactory.buildclickFileDropZoneBlock(options, frameId, frame, selector);

      // On rajoute la partie acceptation du fichier
      const chooserFile = ChangeFactory.buildAcceptUploadFileChangeBlock(frameId, files);

      for (const line of chooserFile.getLines()) {
        newBlock.addLine(line);
      }
      return newBlock;

    }
  }
}