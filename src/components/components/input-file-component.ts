import { FileService } from './../../services/file/file-service';
import { IComponentModel } from '../../models/i-component-model';
import componentName from '../../constants/component-name';
import { IEventModel } from '../../models/i-event-model';

/**
 * Composant qui permet la gestion des input files
 */
export class InputFilesComponent {

  /**
   * Verifie si l'élément est un input file et retourne un composant
   */
  public static isInputFile(element : HTMLInputElement) : IComponentModel {
    if (element.files && element.files[0]) {
      return { component : componentName.INPUTFILE, element };
    }
    return null;
  }

  /**
   * Modifie l'event et
   * envoie les fichiers au background pour les ajouter dans le zip
   */
  public static editInputFileMessage(event : IEventModel, filesUpload : FileList) : IEventModel {

    event.files = FileService.Instance.sendFilesToBackground(filesUpload);
    return event;
  }
}
