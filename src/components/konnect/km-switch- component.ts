import { SelectorService } from '../../services/selector/selector-service';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';

// Constant
import COMPONENT from '../../constants/component-name';
import CUSTOM_EVENT from '../../constants/events/events-custom';

/**
 * Composant qui permet de gérer les Km switch
 */
export class KmSwitchComponent {

  /**
   * Récupère le IComponent km Switch
   */
  public static getElement(element : HTMLElement) : IComponent {
    const elementFind = ElementService.getKmSwitchElement(element);

    if (elementFind) {

      return { component : COMPONENT.KM_SWITCH, element : elementFind as HTMLElement };
    } else {
      return null;
    }
  }

  /**
   * Modifie l'event message pour km switch
   */
  public static editKmSwitchComponentMessage(event : IMessage, component : IComponent) : IMessage {

    event.selector = SelectorService.Instance.find(component.element);
    event.action = CUSTOM_EVENT.CLICK_MOUSE;
    return event;
  }
}
