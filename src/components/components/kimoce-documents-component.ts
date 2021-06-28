import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';

// Constant
import TAG_NAME from '../../constants/elements/tag-name';
import COMPONENT from '../../constants/component-name';
import CUSTOM_EVENT from '../../constants/events/events-custom';

/**
 * Composant qui permet la gestion du composant Kimoce Documents
 */
export class KimoceDocumentsComponent {

  /**
   * Récupère le IComponent Kimoce documents
   */
  public static getElement(element : HTMLElement) : IComponent {

    if (ElementService.findParentElementWithTagName(element, TAG_NAME.KIMOCE_DOCUMENTS.toUpperCase())) {

      const addButtonElement = ElementService.findAddButtonElement(element);

      if (addButtonElement) {

        // Si c'est un le bouton ajouter un fichier du file dropzone
        return { component : COMPONENT.KIMOCE_DOCUMENTS_ADD_BUTTON , element: addButtonElement };
      } else  {
        return null;
      }

    } else {
      return null;
    }

  }

  /**
   * Edit et retourne l'event pour le kimoceDocuments
   */
  public static editKimoceDocumentsComponentMessage(event : IMessage, component : IComponent) : IMessage {

    if (component.component === COMPONENT.KIMOCE_DOCUMENTS_ADD_BUTTON) {

      event.action = CUSTOM_EVENT.CLICK_DROPZONE;
    }

    return event;
  }

}