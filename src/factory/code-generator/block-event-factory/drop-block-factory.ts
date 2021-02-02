import { ChangeBlockFactory } from './change-block-factory';
import { ClickBlockFactory } from './click-block-factory';
import { Block } from 'code-generator/block';
import { EventModel } from '../../../models/event-model';
import { OptionModel } from '../../../models/options-model';
import ActionEvents from '../../../constants/action-events';

/**
 * Factory qui génère les event liés à l'event drop
 */
export class DropBlockFactory {

  public static generateBlock(event : EventModel, frameId : number, frame : string, options : OptionModel) : Block {
    const { action, selector, files} = event;

    // Si l'action est un drop sur un file dropzone
    if (action === ActionEvents.DROP_DROPZONE) {

      ClickBlockFactory.options = options;
      ClickBlockFactory.frameId = frameId;
      ClickBlockFactory.frame = frame;
      // On rajoute d'abord la partie du click du file dropzone
      const newBlock = ClickBlockFactory.buildclickFileDropZone(selector);

      // On modifie les attribus de la classe utilisé pour les mettre à jour
      ChangeBlockFactory.options = options;
      ChangeBlockFactory.frameId = frameId;
      ChangeBlockFactory.frame = frame;
      // On rajoute la partie acceptation du fichier
      const chooserFile = ChangeBlockFactory.buildAcceptUploadFileChange(selector, files);

      for (const line of chooserFile.getLines()) {
        newBlock.addLine(line);
      }
      return newBlock;

    }
  }
}