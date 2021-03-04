import { ElementService } from '../../services/element/element-service';
import componentName from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import elementsTagName from '../../constants/elements-tagName';
import { IMessage } from '../../interfaces/i-message';
import actionEvents from '../../constants/action-events';

/**
 * Permet de gérer les checkbox
 */
export class CheckboxComponent {

  /**
   * Verifie si c'est un checkbox et retourne le component associé
   * @param element
   */
  public static isCheckboxComponent(element : HTMLElement) : IComponent {

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
  public static editCheckboxMessage(event : IMessage) : IMessage {
    event.action = actionEvents.BASIC_CLICK;
    return event;
  }
}