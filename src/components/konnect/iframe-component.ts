import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { SelectorService } from '../../services/selector/selector-service';
import { ElementService } from '../../services/element/element-service';

// Constant
import COMPONENT from '../../constants/component-name';

/**
 * Composant qui permet de gérer les iframe
 */
export class IframeComponent {

  /**
   * Récupère le IComponent Iframe
   */
  public static getElement(element : HTMLElement) : IComponent {

    const iframeElement = ElementService.getIframeElement(element);
    // Si c'est un iframe on retourne le composant associé
    if (iframeElement) {
      return { component: COMPONENT.IFRAME, element: iframeElement as HTMLElement };
    } else {
      return null;
    }
  }

  /**
   * Modifier l'event et retourne les modifications liées à l'iframe
   */
  public static editIframeComponentMessage(event : IMessage, component : IComponent) : IMessage {

    event.iframe = SelectorService.Instance.find(component.element);
    return event;
  }

}