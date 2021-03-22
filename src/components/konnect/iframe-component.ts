import { IMessage } from '../../interfaces/i-message';
import componentName from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import { SelectorService } from '../../services/selector/selector-service';
import { ElementService } from '../../services/element/element-service';

/**
 * Composant qui permet de gérer les iframe
 */
export class IframeComponent {

  /**
   * Récupère le component Iframe
   */
  public static getIframe(element : HTMLElement) : IComponent {

    const iframeElement = ElementService.isInIframeElement(element);
    // Si c'est un iframe on retourne le composant associé
    if (iframeElement) {
      return {component: componentName.IFRAME, element: iframeElement as HTMLElement};
    } else {
      return null;
    }
  }

  /**
   * Modifier l'event et retourne les modifications liées à l'iframe
   */
  public static editIframeMessage(event : IMessage, component : IComponent) : IMessage {

    event.iframe = SelectorService.find(component.element);
    return event;
  }

}