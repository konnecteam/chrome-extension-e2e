import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import { IMessage } from '../../interfaces/i-message';
import actionEvents from '../../constants/action-events';
import componentName from '../../constants/component-name';


/**
 * Composant qui permet la gestion des K select
 */
export class KSelectComponent {

  /**
   * Récupère le component kselect
   */
  public static getKSelect(element : HTMLElement) : IComponent {

    // Si c'est un k select qui se situe dans input numeric
    if (ElementService.isNumericElement(element) &&
     ElementService.getKSelectElement(element)) {
      return { component: componentName.KSELECT, element };
    } else {
      return null;
    }
  }

  /**
   * Edit le message pour les k select
   */
  public static editKSelectMessage(event : IMessage) : IMessage {
    event.action = actionEvents.CLICKMOUSE_INPUTNUMERIC;
    return event;
  }
}