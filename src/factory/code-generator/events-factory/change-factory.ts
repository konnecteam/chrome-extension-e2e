import { IOption } from './../../../interfaces/i-options';
import { ClickFactory } from './click-factory';
import { IMessage } from '../../../interfaces/i-message';
import { Block } from '../../../code-generator/block';
import { ETagName} from '../../../enum/elements/tag-name';
import { ECustomEvent } from '../../../enum/events/events-custom';

// Constant
import { EDomEvent } from '../../../enum/events/events-dom';

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
      case ECustomEvent.CHANGE_INPUT_NUMERIC :
        return this.buildInputNumericNewValue(frameId, frame, selector, value, selectorFocus);

      // Si c'est un change
      case EDomEvent.CHANGE :

        // Si c'est un select
        if (tagName === ETagName.SELECT.toUpperCase()) {

          return this.buildSelectChangeBlock(frameId, frame, selector, value);

        } else if (files) {
          // Si il y a des files c'est que c'est un change dans un input files
          return this.buildAcceptUploadFileChangeBlock(options, frameId, frame, selector, files);
        } else {
          // Sinon c'est un input simple
          return this.buildNewValue(frameId, frame, selector, value);
        }
      // Si c'est un change dans un tags list
      case ECustomEvent.CHANGE_TAGS_LIST :
        return this.buildTagsListNewValue(frameId, frame, selector, value);
      default : return null;
    }
  }

  /**
   * Généré le change d'un input numeric
   */
  public static buildInputNumericNewValue(
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
      type : EDomEvent.CHANGE,
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
      type : EDomEvent.CHANGE,
      value : `await ${frame}.select('${selector}', \`${value}\`);`
    });
  }

 /**
  * Génère un change basique
  */
  public static buildNewValue(
    frameId : number,
    frame : string,
    selector : string,
    value : string
  ) : Block {

   // On remplace : \n par \\r\\n pour l'exportation du script
    return new Block(frameId, {
      type : EDomEvent.CHANGE,
      value : `await ${frame}.evaluate( () => document.querySelector('${selector}').value = "");
      await ${frame}.type('${selector}', \`${value.replace(/\n/g, '\\r\\n')}\`);`
    });
  }

  /**
   * Génère une change dans une taglist
   */
  public static buildTagsListNewValue(
    frameId : number,
    frame : string,
    selector : string,
    value : string
  ) : Block {

    return new Block(frameId, {
      type : EDomEvent.CHANGE,
      value : ` await ${frame}.evaluate( async function () {
        let element = document.querySelector('${selector}');
        element.au['tags-list'].viewModel.value.push('${value}');
      })`
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
      type : EDomEvent.DROP,
      value : ` await fileChooser.accept(${JSON.stringify(filesList)});`
    });

    return block;
  }
}