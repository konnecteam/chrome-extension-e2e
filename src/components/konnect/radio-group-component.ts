import { ElementService } from '../../services/element/element-service';
import { IComponent } from '../../interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';
import { ETagName } from '../../enum/elements/tag-name';
import { EComponent } from '../../enum/component/component';
import { EDomEvent } from '../../enum/events/events-dom';

/**
 * Permet de gérer les RadioGroup
 */
export class RadioGroupComponent {

  /**
   * Récupère le IComponent radiogroup
   */
  public static getElement(element : HTMLElement) : IComponent {

    if (ElementService.findParentElementWithTagName(element, ETagName.RADIOGROUP.toUpperCase())) {

      return { component : EComponent.RADIO_GROUP, element };
    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un RadioGroup
   */
  public static editRadioGroupComponentMessage(event : IMessage) : IMessage {
    event.action = EDomEvent.CLICK;
    return event;
  }
}