import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import { IMessage } from '../../interfaces/i-message';
import { ECustomEvent } from '../../enum/events/events-custom';
import { EComponent } from '../../enum/component/component';


/**
 * Composant qui permet la gestion des K select
 */
export class KSelectComponent {

  /**
   * Récupère le IComponent kselect
   */
  public static getElement(element : HTMLElement) : IComponent {

    // Si c'est un k select qui se situe dans input numeric
    if (ElementService.getNumericElement(element) && ElementService.getKSelectElement(element)) {

      return { component : EComponent.K_SELECT, element };
    } else {
      return null;
    }
  }

  /**
   * Edit le message pour les k select
   */
  public static editKSelectComponentMessage(event : IMessage) : IMessage {
    event.action = ECustomEvent.CLICK_MOUSE_INPUT_NUMERIC;
    return event;
  }
}