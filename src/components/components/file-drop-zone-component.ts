import { FileService } from './../../services/file/file-service';
import { IEventModel } from '../../models/i-event-model';
import { IComponentModel } from '../../models/i-component-model';
import { ElementFinderService } from '../../services/finder/element-finder-service';
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
   * Vérifie si l'élément est dans un file dropzone
   */
  public static isFileDropZone(element : HTMLElement) : IComponentModel {
    const elementFileDropZone = ElementFinderService.findParentElementWithTagName(
      element,
      elementsTagName.FILEDROPZONE.toUpperCase(),
       10
    );

    const elementButtonAdd = ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element,
      elementsTagName.LINK.toUpperCase(),
      this._TITLE_ATTRIBUTE,
      this._TITLE_ATTRIBUTE_VALUE,
      2
    );
    // Si c'est un file  dropzone
    if (elementFileDropZone) {

      return {component : componentName.FILEDROPZONE , element: elementFileDropZone};

    } else if (elementButtonAdd) {
      // Si c'est un le bouton ajouter un fichier du file dropzone
      return {component : componentName.FILEDROPZONEADD , element: elementButtonAdd};

    } else {
      return null;
    }
  }

  /**
   * Edit et retourne l'event pour le file dropzone event
   */
  public static editFileDropZoneMessage(event : IEventModel, files : FileList) : IEventModel {
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
  public static editFileDropZoneButtonMessage(event : IEventModel) : IEventModel {
    event.action = actionEvents.CLICK_DROPZONE;
    return event;
  }

}