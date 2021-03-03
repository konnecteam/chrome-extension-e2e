import elementsTagName  from '../../constants/elements-tagName';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import { IEvent } from '../../interfaces/i-event';
import actionEvents from '../../constants/action-events';
import componentName from '../../constants/component-name';


/**
 * Composant qui permet la gestion des K select
 */
export class KSelectComponent {

  /**
   * Verifie si l'element est un k select et retourne le composant associé
   */
  public static isKSelect(element : HTMLElement) : IComponent {

    // Si c'est un k select qui se situe dans input numeric
    if (ElementService.isNumericElement(element) &&
     ElementService.isKSelectElement(element)) {
      return { component: componentName.KSELECT, element };
    } else {
      return null;
    }
  }

  /**
   * Edit le message pour les k select
   */
  public static editKSelectMessage(event : IEvent) : IEvent {
    event.action = actionEvents.CLICKMOUSE_INPUTNUMERIC;
    return event;
  }
}