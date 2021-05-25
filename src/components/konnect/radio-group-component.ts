import { ElementService } from '../../services/element/element-service';
import componentName from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import elementsTagName from '../../constants/elements/tag-name';
import { IMessage } from '../../interfaces/i-message';
import eventsDom from '../../constants/events/events-dom';

/**
 * Permet de gérer les RadioGroup
 */
export class RadioGroupComponent {

  /**
   * Récupère le IComponent radiogroup
   * @param element
   */
  public static getElement(element : HTMLElement) : IComponent {

    if (ElementService.findParentElementWithTagName(
      element,
      elementsTagName.RADIOGROUP.toUpperCase()
    )) {

      return { component: componentName.RADIO_GROUP, element };

    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un RadioGroup
   */
  public static editRadioGroupComponentMessage(event : IMessage) : IMessage {
    event.action = eventsDom.CLICK;
    return event;
  }
}