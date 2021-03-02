import { ElementFinderService } from '../../services/finder/element-finder-service';
import componentName from '../../constants/component-name';
import { ComponentModel } from '../../models/component-model';
import elementsTagName from '../../constants/elements-tagName';
import { EventModel } from '../../models/event-model';
import actionEvents from '../../constants/action-events';

/**
 * Permet de gérer les RadioGroup
 */
export class RadioGroupComponent {

  /**
   * Verifie si c'est un RadioGroup et retourne le component associé
   * @param element
   */
  public static isRadioGroupComponent(element : HTMLElement) : ComponentModel {

    if (ElementFinderService.findParentElementWithTagName(
      element,
      elementsTagName.RADIOGROUP.toUpperCase(),
      5
    )) {

      return { component: componentName.RADIOGROUP, element };

    }
    return null;
  }

  /**
   * Modification de l'event pour un RadioGroup
   */
  public static editRadioGroupMessage(event : EventModel) : EventModel {
    event.action = actionEvents.BASIC_CLICK;
    return event;
  }
}