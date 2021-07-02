import { IMessage } from '../../interfaces/i-message';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';

// Constant
import CUSTOM_EVENT from '../../constants/events/events-custom';
import COMPONENT from '../../constants/component-name';

/**
 * Composant qui permet de gérer les input list
 */
export class InputListComponent {

  /**
   * Récupère un IComponent input list
   */
  public static getElement(
    element : HTMLElement
  ) : IComponent {

    // On vérifie si c'est un input
    const input = ElementService.getInputList(element);

    if (input) {

      return { component : COMPONENT.INPUT_LIST, element : input as HTMLElement };
    } else {

      return null;
    }

  }

  /**
   * On modifie l'event model en fonction de l'action voulue
   */
  public static editInputListComponentMessage(event : IMessage) : IMessage {

    event.action = CUSTOM_EVENT.CLICK_MOUSE;

    return event;
  }

}