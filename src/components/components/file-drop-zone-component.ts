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

  /** Attribut titre d'un HTMLElement */
  private static readonly  _TITLE_ATTRIBUTE = 'title';

  /** Valeur de l'attribut titre */
  private static readonly _TITLE_ATTRIBUTE_VALUE = 'Ajouter un document';

  /**
   * Récupère le IComponent filedropzone
   */
  public static getElement(element : HTMLElement) : IComponent {

    const fileDropzoneElement = ElementService.findParentElementWithTagName(
      element,
      TAG_NAME.FILE_DROPZONE.toUpperCase()
    );

    const addButtonElement = ElementService.findParentElementWithTagNameAndValueAttribute(
      element,
      TAG_NAME.LINK.toUpperCase(),
      this._TITLE_ATTRIBUTE,
      this._TITLE_ATTRIBUTE_VALUE
    );

    // Si c'est un file dropzone
    if (fileDropzoneElement) {

      return { component : COMPONENT.FILE_DROPZONE , element: fileDropzoneElement };

    } else if (addButtonElement) {
      // Si c'est un le bouton ajouter un fichier du file dropzone
      return { component : COMPONENT.BUTTON_ADD_FILE_DROPZONE , element: addButtonElement };

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

  /**
   * Edit et retourne l'event pour le click sur le bouton ajouter des fichiers
   */
  public static editFileDropZoneButtonComponentMessage(event : IMessage) : IMessage {
    event.action = CUSTOM_EVENT.CLICK_DROPZONE;
    return event;
  }

}