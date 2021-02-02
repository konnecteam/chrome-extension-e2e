import { EventModel } from '../../../models/event-model';
import { OptionModel } from '../../../models/options-model';
import ActionEvents from '../../../constants/action-events';
import domEventsToRecord from '../../../constants/dom-events-to-record';
import { Block } from '../../../code-generator/block';
import elementsTagName from '../../../constants/elements-tagName';

/**
 * Factory qui permet de créér les block liés à l'événement change
 */
export class ChangeBlockFactory {

  // les attributs sont utilisés pour éviter de les passer en paramètre méthodes

  /** Options du plugin */
  public static options : OptionModel;

  /** Id de la frame */
  public static frameId : number;

  /** Frame courante */
  public static frame : string;

  // Génère les blocks en fonction des paramètres données
  public static generateBlock(
    event : EventModel,
    frameId : number,
    frame : string,
    options : OptionModel
  ) : Block {

    const { action, selector, value, tagName, files, selectorFocus} = event;
    this.options = options;
    this.frameId = frameId;
    this.frame = frame;

    // En fonction de l'action détéctée
    switch (action) {
      // Si c'est un changement dans un input numeric
      case ActionEvents.CHANGE_INPUTNUMERIC:
        return this.buildChangeInputNumeric(selector, value,
          selectorFocus);
        break;
      // Si c'est un change
      case ActionEvents.CHANGE:

        // Si c'est un select
        if (tagName === elementsTagName.SELECT.toUpperCase()) {

          return this.buildSelectChange(selector, value);

        } else if (files) {
          // Si il y a des files c'est qu c'est un change dans un input files
          return this.buildAcceptUploadFileChange(selector, files);
        } else {
          // Sinon c'est un input simple
          return this.buildChange(selector, value);
        }
        break;
    }
  }

  /**
   * Généré le change d'un input numeric
   */
  public static buildChangeInputNumeric(selector : string , value : string,
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
       input.value = "${value}";
       input.dispatchEvent(new Event('blur'));
       return Promise.resolve('finish');
     })`
    });
    return block;
  }

 /**
  * Génère un changement de valeur d'un select
  */
  public static buildSelectChange(selector : string, value : string) : Block {
    return new Block(this.frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${this.frame}.select('${selector}', '${value}');`
    });
  }

 /**
  * Génère un change de valeur
  */
  public static buildChange(selector : string, value : string) : Block {
   // we replace: \n  by \\r\\n for exportation script
    return new Block(this.frameId, {
      type: domEventsToRecord.CHANGE,
      value: `await ${this.frame}.evaluate( () => document.querySelector('${selector}').value = "");\n await ${this.frame}.type('${selector}', '${value.replace(/\n/g, '\\r\\n')}');`
    });
  }

  /**
   * Génère une acceptation d'uploader de fichier
   */
  public static buildAcceptUploadFileChange(selector : string, files : string) : Block {

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