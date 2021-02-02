import { ElementFinderService } from '../../services/finder/element-finder-service';
import componentName from '../../constants/component-name';
import { ComponentModel } from '../../models/component-model';
import elementsTagName from '../../constants/elements-tagName';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';

/**
 * Permet de gérer les checkbox
 */
export class CheckboxComponent {

  /**
   * Verifie si c'est un checkbox et retourne le component associé
   * @param element
   */
  public static isCheckboxComponent(element : HTMLElement) : ComponentModel {

    if (this._isCheckboxElement(element)) {

      return { component: componentName.CHECKBOX, element };

    }
    return null;
  }

  /**
   * Permet de récupérer l'element checkbox
   * @param element
   */
  private static _isCheckboxElement(element : HTMLElement) : HTMLElement {

    return ElementFinderService.findParentElementWithTagName(
      element,
      elementsTagName.CHECKBOX.toUpperCase(),
      5
    );
  }

  /**
   * Modification de l'event pour un checkbox
   */
  public static editCheckboxMessage(event : EventModel) : EventModel {
    event.action = actionEvents.BASIC_CLICK;
    return event;
  }
}