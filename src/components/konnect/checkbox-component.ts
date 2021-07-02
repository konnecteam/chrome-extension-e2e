import { ElementService } from '../../services/element/element-service';
import { IComponent } from '../../interfaces/i-component';
import { IMessage } from '../../interfaces/i-message';

// Constant
import DOM_EVENT from '../../constants/events/events-dom';
import COMPONENT from '../../constants/component-name';
import TAG_NAME from '../../constants/elements/tag-name';

/**
 * Permet de gérer les checkbox
 */
export class CheckboxComponent {

  /**
   * Récupère le IComponent Checkbox
   * @param element
   */
  public static getElement(element : HTMLElement) : IComponent {

    if (ElementService.findParentElementWithTagName(
      element,
      TAG_NAME.CHECKBOX.toUpperCase()
    )) {

      return { component : COMPONENT.CHECKBOX, element };

    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un checkbox
   */
  public static editCheckboxComponentMessage(event : IMessage) : IMessage {
    event.action = DOM_EVENT.CLICK;
    return event;
  }
}