import { IOption } from './../../../interfaces/i-options';
import { ClickFactory } from './click-factory';
import { IMessage } from '../../../interfaces/i-message';
import { Block } from '../../../code-generator/block';

// Constant
import TAG_NAME from '../../../constants/elements/tag-name';
import DOM_EVENT from '../../../constants/events/events-dom';
import CUSTOM_EVENT from '../../../constants/events/events-custom';

/**
 * Factory qui permet de créér des objets liés à l'événement change
 */
export class ChangeFactory {

  /** Génère les blocks en fonction des paramètres données */
  public static buildBlock(event : IMessage, frameId : number, frame : string, options : IOption) : Block {

    const { action, selector, value, tagName, files, selectorFocus } = event;

    // En fonction de l'action détéctée
    switch (action) {

      // Si c'est un changement dans un input numeric
      case CUSTOM_EVENT.CHANGE_INPUT_NUMERIC :
        return this.buildInputNumericChangedBlock(frameId, frame, selector, value, selectorFocus);

      // Si c'est un change
      case DOM_EVENT.CHANGE :

        // Si c'est un select
        if (tagName === TAG_NAME.SELECT.toUpperCase()) {

          return this.buildSelectChangeBlock(frameId, frame, selector, value);

        } else if (files) {
          // Si il y a des files c'est que c'est un change dans un input files
          return this.buildAcceptUploadFileChangeBlock(options, frameId, frame, selector, files);
        } else {
          // Sinon c'est un input simple
          return this.buildChangeBlock(frameId, frame, selector, value);
        }
      default : return null;
    }
  }

  /**
   * Généré le change d'un input numeric
   */
  public static buildInputNumericChangedBlock(
    frameId : number,
    frame : string,
    selector : string ,
    value : string,
    selectorFocus : string
  ) : Block {

    const block = new Block(frameId);
    block.addLine({
      type : 'focus',
      value : `await page.focus('${selectorFocus}');`
    });

    block.addLine({
      type : DOM_EVENT.CHANGE,
      value : `await ${frame}.evaluate( async function(){
       let input = document.querySelector('${selector}');
       input.value = '${value}';
       input.dispatchEvent(new Event('blur'));
     })`
    });

    return block;
  }

 /**
  * Génère un changement de valeur d'un select
  */
  public static buildSelectChangeBlock(
    frameId : number,
    frame : string,
    selector : string,
    value : string
  ) : Block {

    return new Block(frameId, {
      type : DOM_EVENT.CHANGE,
      value : `await ${frame}.select('${selector}', \`${value}\`);`
    });
  }

 /**
  * Génère un change basique
  */
  public static buildChangeBlock(
    frameId : number,
    frame : string,
    selector : string,
    value : string
  ) : Block {

   // On remplace : \n par \\r\\n pour l'exportation du script
    return new Block(frameId, {
      type : DOM_EVENT.CHANGE,
      value : `await ${frame}.evaluate( () => document.querySelector('${selector}').value = "");
      await ${frame}.type('${selector}', \`${value.replace(/\n/g, '\\r\\n')}\`);`
    });
  }

  /**
   * Génère une acceptation d'uploader de fichier
   */
  public static buildAcceptUploadFileChangeBlock(options : IOption, frameId : number, frame : string , selector : string, files : string) : Block {

    const block = ClickFactory.buildFileDropZoneClickBlock(options, frameId, frame, selector);

    const path = './recordings/files';
    const filesList = files.split(';');

    for (let i = 0; i < filesList.length; i++) {
      filesList[i] = `${path}/${filesList[i]}`;
    }

    block.addLine({
      type : DOM_EVENT.DROP,
      value : ` await fileChooser.accept(${JSON.stringify(filesList)});`
    });

    return block;
  }
}