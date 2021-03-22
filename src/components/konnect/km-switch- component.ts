import { SelectorService } from '../../services/selector/selector-service';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import componentName from '../../constants/component-name';
import actionEvents from '../../constants/action-events';

/**
 * Composant qui permet de gérer les Km switch
 */
export class KmSwitchComponent {

  /**
   * Récupère le component km Switch
   */
  public static getKmSwitch(element : HTMLElement) : IComponent {
    const elementFind = ElementService.getKmSwitchElement(element);

    if (elementFind) {
      return { component: componentName.KMSWITCH, element: elementFind as HTMLElement };
    } else {
      return null;
    }
  }

  /**
   * Modifie l'event message pour km switch
   */
  public static editKmSwitchMessage(event : IMessage, component : IComponent) : IMessage {

    event.selector = SelectorService.find(component.element);
    event.action = actionEvents.CLICKMOUSE;
    return event;
  }
}
