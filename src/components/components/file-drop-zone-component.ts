import { FileService } from './../../services/file/file-service';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';

// Constant
import TAG_NAME from '../../constants/elements/tag-name';
import COMPONENT from '../../constants/component-name';
import CUSTOM_EVENT from '../../constants/events/events-custom';

/**
 * Composant qui permet la gestion du composant file dropzone
 */
export class FileDropZoneComponent {

  /**
   * Récupère le IComponent filedropzone
   */
  public static getElement(element : HTMLElement) : IComponent {

    const fileDropzoneElement = ElementService.findParentElementWithTagName(
      element,
      TAG_NAME.FILE_DROPZONE.toUpperCase()
    );

    // Si c'est un file dropzone
    if (fileDropzoneElement) {

      return { component : COMPONENT.FILE_DROPZONE , element: fileDropzoneElement };
    } else {

      return null;
    }
  }

  /**
   * Edit et retourne l'event pour le file dropzone event
   */
  public static editFileDropZoneComponentMessage(event : IMessage, files : FileList) : IMessage {
    const newMessage = event;

    /* Si il y a des fichiers à uplaoder
       On les envoie au background pour qu'il les rajoute dans le zip
    */
    if (files) {
      newMessage.action = CUSTOM_EVENT.DROP_FILE;
      newMessage.files = FileService.Instance.prepareFilesForScenario(files);

    } else {
      // Sinon c'est qu'on a juste click sur la dropzone
      newMessage.action = CUSTOM_EVENT.CLICK_DROPZONE;
    }

    return newMessage;
  }
}