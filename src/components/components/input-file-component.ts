import { FileService } from './../../services/file/file-service';
import { IComponent } from '../../interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';
import { EComponentName }  from '../../enum/component/component-name';

/**
 * Composant qui permet la gestion des input files
 */
export class InputFilesComponent {

  /**
   * Récupère le IComponent input file
   */
  public static getElement(element : HTMLInputElement) : IComponent {
    if (element.files && element.files[0]) {
      return { component : EComponentName.INPUT_FILE, element };
    }
    return null;
  }

  /**
   * Modifie l'event et
   * envoie les fichiers au background pour les ajouter dans le zip
   */
  public static editInputFileComponentMessage(event : IMessage, filesUpload : FileList) : IMessage {

    event.files = FileService.Instance.prepareFilesForScenario(filesUpload);
    return event;
  }
}
