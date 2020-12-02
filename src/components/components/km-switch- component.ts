import { SelectorService } from '../../services/selector/selector-service';
import { EventModel } from '../../models/event-model';
import { ComponentModel } from '../../models/component-model';
import elementsTagName from '../../constants/elements-tagName';
import { ElementFinderService } from '../../services/finder/element-finder-service';
import componentName from '../../constants/component-name';
import actionEvents from '../../constants/action-events';

/**
 * Composant qui permet de gérer les Km switch
 */
export class KmSwitchComponent {

  /** Contenu de la class d'un KmSwitch handle */
  private static readonly _KMSWITCH_HANDLE = 'km-switch-handle';

  /** Contenu de class d'un KmSwitch */
  private static readonly _KMSWITCH = 'km-switch';

  /** KmSwitch conteneur */
  private static readonly _KMSWITCH_CONTAINER = 'km-switch-container';

  /** Attribut class d'un HTMLElement */
  private static readonly _CLASS = 'class';

  /**
   * Verifie si l'élément est un km switch
   */
  private static _isKmSwitchElement(element : HTMLElement) : Element {

    if (ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      element, elementsTagName.SPAN.toUpperCase(), this._CLASS, this._KMSWITCH_HANDLE, 1
    )) {

      return element;
    }

    return this._findKmSwitchElement(element);
  }

  /**
   * Trouve le km switch si le click est tout proche de lui
   */
  private static _findKmSwitchElement(element : HTMLElement) : Element {

    const parentElement = element.parentElement;
    if (ElementFinderService.findParentElementWithTagNameAndValueAttribute(
      parentElement, elementsTagName.SPAN.toUpperCase(), this._CLASS, this._KMSWITCH, 1
    )) {

      const container = ElementFinderService.findElementChildWithSelector(parentElement, `.${this._KMSWITCH_CONTAINER}`);
      if (container) {

        return ElementFinderService.findElementChildWithSelector(container as HTMLElement, `.${this._KMSWITCH_HANDLE}`);
      }
    }
    return null;
  }

  /**
   * Verifie si l'élément est un km switch
   */
  public static isKmSwitch(element : HTMLElement) : ComponentModel {
    const elementFind = this._isKmSwitchElement(element);

    if (elementFind) {
      return { component: componentName.KMSWITCH, element: elementFind as HTMLElement };
    }
    return null;
  }

  /**
   * Modifie le event message pour kmswitch
   */
  public static editKmSwitchMessage(event : EventModel, component : ComponentModel) : EventModel {

    event.selector = SelectorService.find(component.element);
    event.action = actionEvents.CLICKMOUSE;
    return event;
  }
}
