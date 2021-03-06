import { ChangeFactory } from './change-factory';
import { Block } from 'code-generator/block';
import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import { ECustomEvent } from '../../../enum/events/events-custom';

/**
 * Factory qui permet de créér des objets liés à l'event drop
 */
export class DropFactory {

  /** Génère un block de code correpondant à l'évènement drop */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, selector, files} = event;

    // Si l'action est un drop sur un file dropzone
    if (action === ECustomEvent.DROP_FILE) {

      // On créé un block qui contient le click et l'acceptation de fichier
      return ChangeFactory.buildAcceptUploadFileChangeBlock(options, frameId, frame, selector, files);
    }
  }
}