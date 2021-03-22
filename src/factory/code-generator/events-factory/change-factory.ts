import { IMessage } from '../../../interfaces/i-message';
import { IOption } from '../../../interfaces/i-options';
import customEvents from '../../../constants/events/events-custom';
import domEventsToRecord from '../../../constants/events/events-dom';
import { Block } from '../../../code-generator/block';
import elementsTagName from '../../../constants/elements/tag-name';
import eventsDom from '../../../constants/events/events-dom';

/**
 * Factory qui permet de créér des objets liés à l'événement change
 */
export class ChangeFactory {

  // les attributs sont utilisés pour éviter de les passer en paramètre méthodes

  /** Options du plugin */
  public static options : IOption;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;

  // Génère les blocks en fonction des paramètres données
  public static generateBlock(
    event : IMessage,
    frameId : number,
    frame : string,
    options : IOption
  ) : Block {

    const { action, selector, value, tagName, files, selectorFocus} = event;
    this.options = options;
    this.frameId = frameId;
    this.frame = frame;

    // En fonction de l'action détéctée
    switch (action) {
      // Si c'est un changement dans un input numeric
      case customEvents.CHANGE_INPUT_NUMERIC:
        return this.buildChangeBlockInputNumericBlock(selector, value,
          selectorFocus);
      // Si c'est un change
      case eventsDom.CHANGE:

        // Si c'est un select
        if (tagName === elementsTagName.SELECT.toUpperCase()) {

          return this.buildSelectChangeBlock(selector, value);

        } else if (files) {
          // Si il y a des files c'est qu c'est un change dans un input files
          return this.buildAcceptUploadFileChangeBlock(selector, files);
        } else {
          // Sinon c'est un input simple
          return this.buildChangeBlock(selector, value);
        }
    }
  }

  /**
   * Généré le change d'un input numeric
   */
  public static buildChangeBlockInputNumericBlock(selector : string , value : string,
    selectorFocus : string) : Block {

    const block = new Block(this.frameId);
    block.addLine({
      type: 'focus',
      value: `await page.focus('${selectorFocus}');`
    });

    block.addLine({
      type: domEventsToRecord.CHANGE,
      value: `await ${this.frame}.evaluate( async function(){
       let input = document.querySelector('${selector}');
       input.value = '${value}';
       input.dispatchEvent(new Event('blur'));
       return Promise.resolve('finish');
     })`
    });
    return block;
  }

 /**
  * Génère un changement de valeur d'un select
  */
  public static buildSelectChangeBlock(selector : string, value : string) : Block {
    return new Block(this.frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${this.frame}.select('${selector}', \`${value}\`);`
    });
  }

 /**
  * Génère un change de valeur
  */
  public static buildChangeBlock(selector : string, value : string) : Block {
   // On remplace : \n par \\r\\n pour l'exportation du script
    return new Block(this.frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${this.frame}.evaluate( () => document.querySelector('${selector}').value = "");
      await ${this.frame}.type('${selector}', \`${value.replace(/\n/g, '\\r\\n')}\`);`
    });
  }

  /**
   * Génère une acceptation d'uploader de fichier
   */
  public static buildAcceptUploadFileChangeBlock(selector : string, files : string) : Block {

    const block = new Block(this.frameId);
    let listFile = '';
    const pathBase = './recordings/files/';
    const filesList = files.split(';');

    if (filesList.length > 1) {
      for (let i = 0; i < filesList.length; i++) {
        const currentFile = filesList[i];
        listFile += '"' + pathBase + currentFile + '"';
        if (i < filesList.length - 1) {
          listFile += listFile + ',';
        }
      }
    }
    else {
      listFile += '"' + pathBase + files + '"';
    }

    block.addLine({
      type: domEventsToRecord.DROP,
      value: ` await fileChooser.accept([${listFile}]);`
    });
    return block;
  }


}