import { FileService } from './../../services/file/file-service';
import { IComponent } from '../../interfaces/i-component';
import componentName from '../../constants/component-name';
import { IEvent } from '../../interfaces/i-event';

/**
 * Composant qui permet la gestion des input files
 */
export class InputFilesComponent {

  /**
   * Verifie si l'élément est un input file et retourne un composant
   */
  public static isInputFile(element : HTMLInputElement) : IComponent {
    if (element.files && element.files[0]) {
      return { component : componentName.INPUTFILE, element };
    }
    return null;
  }

  /**
   * Modifie l'event et
   * envoie les fichiers au background pour les ajouter dans le zip
   */
  public static editInputFileMessage(event : IEvent, filesUpload : FileList) : IEvent {

    event.files = FileService.Instance.sendFilesToBackground(filesUpload);
    return event;
  }
}
