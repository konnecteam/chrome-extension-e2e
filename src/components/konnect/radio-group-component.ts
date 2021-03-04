import { ElementService } from '../../services/element/element-service';
import componentName from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import elementsTagName from '../../constants/elements-tagName';
import { IMessage } from '../../interfaces/i-message';
import actionEvents from '../../constants/action-events';

/**
 * Permet de gérer les RadioGroup
 */
export class RadioGroupComponent {

  /**
   * Verifie si c'est un RadioGroup et retourne le component associé
   * @param element
   */
  public static isRadioGroupComponent(element : HTMLElement) : IComponent {

    if (ElementService.findParentElementWithTagName(
      element,
      elementsTagName.RADIOGROUP.toUpperCase()
    )) {

      return { component: componentName.RADIOGROUP, element };

    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un RadioGroup
   */
  public static editRadioGroupMessage(event : IMessage) : IMessage {
    event.action = actionEvents.BASIC_CLICK;
    return event;
  }
}