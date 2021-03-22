import { FileService } from './../../services/file/file-service';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import elementsTagName from '../../constants/elements-tagName';
import componentName from '../../constants/component-name';
import actionEvents from '../../constants/action-events';

/**
 * Composant qui permet la gestion du composant file dropzone
 */
export class FileDropZoneComponent {

  /** Attribut titre d'un HTMLElement */
  private static readonly  _TITLE_ATTRIBUTE = 'title';

  /** Valeur de l'attribut titre */
  private static readonly _TITLE_ATTRIBUTE_VALUE = 'Ajouter un document';

  /**
   * Récupère le component filedropzone
   */
  public static getFileDropZone(element : HTMLElement) : IComponent {
    const fileDropzoneElement = ElementService.findParentElementWithTagName(
      element,
      elementsTagName.FILEDROPZONE.toUpperCase()
    );

    const addButtonElement = ElementService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.LINK.toUpperCase(),
      this._TITLE_ATTRIBUTE,
      this._TITLE_ATTRIBUTE_VALUE
    );

    // Si c'est un file dropzone
    if (fileDropzoneElement) {

      return {component : componentName.FILEDROPZONE , element: fileDropzoneElement};

    } else if (addButtonElement) {
      // Si c'est un le bouton ajouter un fichier du file dropzone
      return {component : componentName.FILEDROPZONEADD , element: addButtonElement};

    } else {
      return null;
    }
  }

  /**
   * Edit et retourne l'event pour le file dropzone event
   */
  public static editFileDropZoneMessage(event : IMessage, files : FileList) : IMessage {
    const newMessage = event;

    /* Si il y a des fichiers à uplaoder
       On les envoie au background pour qu'il les rajoute dans le zip
    */
    if (files) {
      newMessage.action = actionEvents.DROP_DROPZONE;
      newMessage.files = FileService.Instance.sendFilesToBackground(files);

    } else {
      // Sinon c'est qu'on a juste click sur la dropzone
      newMessage.action = actionEvents.CLICK_DROPZONE;
    }

    return newMessage;
  }

  /**
   * Edit et retourne l'event pour le click sur le bouton ajouter des fichiers
   */
  public static editFileDropZoneButtonMessage(event : IMessage) : IMessage {
    event.action = actionEvents.CLICK_DROPZONE;
    return event;
  }

}