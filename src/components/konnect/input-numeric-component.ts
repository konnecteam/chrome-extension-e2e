import { SelectorService } from '../../services/selector/selector-service';
import  componentName  from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import customEvents from '../../constants/events/events-custom';
import { IMessage } from '../../interfaces/i-message';


/**
 * Permet de gérer l'input numeric
 */
export class InputNumericComponent {

  /**
   * Récupère le component input numeric
   */
  public static getInputNumeric(element : HTMLElement) : IComponent  {

    if (ElementService.getNumericElement(element)) {

      const inputElement = ElementService.getInputNumericElement(element);
      if (inputElement) {

        return { component: componentName.INPUT_NUMERIC, element : inputElement as HTMLElement };
      }
    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un input numeric
   */
  public static editInputNumericMessage(event : IMessage, component : IComponent) : IMessage {

    event.selectorFocus = SelectorService.Instance.find(component.element);
    event.action = customEvents.CHANGE_INPUT_NUMERIC;
    return event;
  }
}