import { FileService } from './../../services/file/file-service';
import { IComponent } from '../../interfaces/i-component';
import componentName from '../../constants/component-name';
import { IMessage } from '../../interfaces/i-message';

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
  public static editInputFileMessage(event : IMessage, filesUpload : FileList) : IMessage {

    event.files = FileService.Instance.sendFilesToBackground(filesUpload);
    return event;
  }
}
