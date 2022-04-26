import { ElementService } from '../../services/element/element-service';
import { IComponent } from '../../interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';
import { ETagName }from '../../enum/elements/tag-name';
import { EComponent } from '../../enum/component/component';
import { EDomEvent } from '../../enum/events/events-dom';

/**
 * Permet de gérer les checkbox
 */
export class CheckboxComponent {

  /**
   * Récupère le IComponent Checkbox
   */
  public static getElement(element : HTMLElement) : IComponent {

    if (ElementService.findParentElementWithTagName(
      element,
      ETagName.CHECKBOX.toUpperCase()
    )) {

      return { component : EComponent.CHECKBOX, element };

    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un checkbox
   */
  public static editCheckboxComponentMessage(event : IMessage) : IMessage {
    event.action = EDomEvent.CLICK;
    return event;
  }
}