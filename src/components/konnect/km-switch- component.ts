import { SelectorService } from '../../services/selector/selector-service';
import { IEvent } from '../../interfaces/i-event';
import { IComponent } from '../../interfaces/i-component';
import elementsTagName from '../../constants/elements-tagName';
import { ElementService } from '../../services/element/element-service';
import componentName from '../../constants/component-name';
import actionEvents from '../../constants/action-events';

/**
 * Composant qui permet de gérer les Km switch
 */
export class KmSwitchComponent {

  /**
   * Verifie si l'élément est un km switch
   */
  public static isKmSwitch(element : HTMLElement) : IComponent {
    const elementFind = ElementService.isKmSwitchElement(element);

    if (elementFind) {
      return { component: componentName.KMSWITCH, element: elementFind as HTMLElement };
    } else {
      return null;
    }
  }

  /**
   * Modifie l'event message pour km switch
   */
  public static editKmSwitchMessage(event : IEvent, component : IComponent) : IEvent {

    event.selector = SelectorService.find(component.element);
    event.action = actionEvents.CLICKMOUSE;
    return event;
  }
}
