import { ElementService } from '../../services/element/element-service';
import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';

// Constant
import CUSTOM_EVENT from '../../constants/events/events-custom';
import COMPONENT from '../../constants/component-name';

/**
 * Composant qui permet de gérer les popover
 */
export class PopoverComponent {

  /**
   * Récupère un IComponent popover
   */
  public static getElement(
    element : HTMLElement
  ) : IComponent {

    // On vérifie si c'est un popover
    if (ElementService.getPopover(element)) {

      return { component: COMPONENT.POPOVER, element };
    } else {

      return null;
    }

  }

  /**
   * On modifie l'event model en fonction de l'action voulue
   */
  public static editPopoverComponentMessage(event : IMessage) : IMessage {

    event.action = CUSTOM_EVENT.CLICK_MOUSE_ENTER;

    return event;
  }

}