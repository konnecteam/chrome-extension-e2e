import { SelectorService } from '../../services/selector/selector-service';
import { IEventModel } from '../../models/i-event-model';
import { IComponentModel } from '../../models/i-component-model';
import elementsTagName from '../../constants/elements-tagName';
import { ElementService } from '../../services/element/element-service';
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
  public static isKmSwitch(element : HTMLElement) : IComponentModel {
    const elementFind = ElementService.isKmSwitchElement(element, this._CLASS, this._KMSWITCH_HANDLE);

    if (elementFind) {
      return { component: componentName.KMSWITCH, element: elementFind as HTMLElement };
    } else {
      return null;
    }
  }

  /**
   * Modifie l'event message pour km switch
   */
  public static editKmSwitchMessage(event : IEventModel, component : IComponentModel) : IEventModel {

    event.selector = SelectorService.find(component.element);
    event.action = actionEvents.CLICKMOUSE;
    return event;
  }
}
