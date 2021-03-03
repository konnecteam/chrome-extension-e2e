import { ElementService } from '../../services/element/element-service';
import componentName from '../../constants/component-name';
import { IComponentModel } from '../../models/i-component-model';
import elementsTagName from '../../constants/elements-tagName';
import { IEventModel } from '../../models/i-event-model';
import actionEvents from '../../constants/action-events';

/**
 * Permet de gérer les checkbox
 */
export class CheckboxComponent {

  /**
   * Verifie si c'est un checkbox et retourne le component associé
   * @param element
   */
  public static isCheckboxComponent(element : HTMLElement) : IComponentModel {

    if (ElementService.findParentElementWithTagName(
      element,
      elementsTagName.CHECKBOX.toUpperCase()
    )) {

      return { component: componentName.CHECKBOX, element };

    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un checkbox
   */
  public static editCheckboxMessage(event : IEventModel) : IEventModel {
    event.action = actionEvents.BASIC_CLICK;
    return event;
  }
}