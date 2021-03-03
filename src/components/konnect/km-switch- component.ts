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

  /**
   * Verifie si l'élément est un km switch
   */
  public static isKmSwitch(element : HTMLElement) : IComponentModel {
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
  public static editKmSwitchMessage(event : IEventModel, component : IComponentModel) : IEventModel {

    event.selector = SelectorService.find(component.element);
    event.action = actionEvents.CLICKMOUSE;
    return event;
  }
}
