import elementsTagName  from '../../constants/elements-tagName';
import { IComponentModel } from '../../models/i-component-model';
import { ElementService } from '../../services/element/element-service';
import { IEventModel } from '../../models/i-event-model';
import actionEvents from '../../constants/action-events';
import componentName from '../../constants/component-name';


/**
 * Composant qui permet la gestion des K select
 */
export class KSelectComponent {

  /**
   * Verifie si l'element est un k select et retourne le composant associé
   */
  public static isKSelect(element : HTMLElement) : IComponentModel {

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
  public static editKSelectMessage(event : IEventModel) : IEventModel {
    event.action = actionEvents.CLICKMOUSE_INPUTNUMERIC;
    return event;
  }
}