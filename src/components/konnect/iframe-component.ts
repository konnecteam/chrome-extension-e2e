import { IEventModel } from '../../models/i-event-model';
import componentName from '../../constants/component-name';
import { IComponentModel } from '../../models/i-component-model';
import { SelectorService } from '../../services/selector/selector-service';
import { ElementFinderService } from '../../services/finder/element-finder-service';

/**
 * Composant qui permet de gérer les iframe
 */
export class IframeComponent {

  /**
   * Verifie si c'est une frame
   */
  public static isIframe(element : HTMLElement) : IComponentModel {

    const iframeElement = this._isInIframeElement(element);
    // Si c'est un iframe on retourne le composant associé
    if (iframeElement) {
      return {component: componentName.IFRAME, element: iframeElement as HTMLElement};
    } else {
      return null;
    }
  }

  /**
   * Verifie si c'est une iframe et la retourne
   */
  private static _isInIframeElement(element : HTMLElement) : Element  {
    const selector = SelectorService.findSelectorIframeElement(element);
    if (selector) {

      return ElementFinderService.findElementChildWithSelector(document.body, selector);
    }
    return null;
  }

  /**
   * Modifier l'event et retourne les modifications liées à l'iframe
   */
  public static editIframeMessage(event : IEventModel, component : IComponentModel) : IEventModel {

    event.iframe = SelectorService.find(component.element);
    return event;
  }

}