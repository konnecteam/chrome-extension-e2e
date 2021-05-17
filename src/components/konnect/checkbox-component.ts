import { ElementService } from '../../services/element/element-service';
import componentName from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import elementsTagName from '../../constants/elements/tag-name';
import { IMessage } from '../../interfaces/i-message';
import eventsDom from '../../constants/events/events-dom';

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
  public static editCheckboxComponentMessage(event : IMessage) : IMessage {
    event.action = eventsDom.CLICK;
    return event;
  }
}