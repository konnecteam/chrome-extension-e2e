import { IEvent } from '../../interfaces/i-event';
import componentName from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import { SelectorService } from '../../services/selector/selector-service';
import { ElementService } from '../../services/element/element-service';

/**
 * Composant qui permet de gérer les iframe
 */
export class IframeComponent {

  /**
   * Verifie si c'est une frame
   */
  public static isIframe(element : HTMLElement) : IComponent {

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
  public static editIframeMessage(event : IEvent, component : IComponent) : IEvent {

    event.iframe = SelectorService.find(component.element);
    return event;
  }

}