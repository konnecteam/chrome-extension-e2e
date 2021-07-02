import { ElementService } from '../../services/element/element-service';
import { IComponent } from '../../interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';

// Constant
import DOM_EVENT from '../../constants/events/events-dom';
import COMPONENT from '../../constants/component-name';
import TAG_NAME from '../../constants/elements/tag-name';

/**
 * Permet de gérer les RadioGroup
 */
export class RadioGroupComponent {

  /**
   * Récupère le IComponent radiogroup
   */
  public static getElement(element : HTMLElement) : IComponent {

    if (ElementService.findParentElementWithTagName(element, TAG_NAME.RADIOGROUP.toUpperCase())) {

      return { component : COMPONENT.RADIO_GROUP, element };
    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un RadioGroup
   */
  public static editRadioGroupComponentMessage(event : IMessage) : IMessage {
    event.action = DOM_EVENT.CLICK;
    return event;
  }
}