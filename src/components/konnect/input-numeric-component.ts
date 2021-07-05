import { SelectorService } from '../../services/selector/selector-service';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import { IMessage } from '../../interfaces/i-message';
import { EComponentName } from '../../enum/component/component-name';
import { ECustomEvent } from '../../enum/events/events-custom';


/**
 * Permet de gérer l'input numeric
 */
export class InputNumericComponent {

  /**
   * Récupère le IComponent input numeric
   */
  public static getElement(element : HTMLElement) : IComponent  {

    if (ElementService.getNumericElement(element)) {

      const inputElement = ElementService.getInputNumericElement(element);

      if (inputElement) {

        return { component : EComponentName.INPUT_NUMERIC, element : inputElement as HTMLElement };
      }
    } else {
      return null;
    }
  }

  /**
   * Modification de l'event pour un input numeric
   */
  public static editInputNumericComponentMessage(event : IMessage, component : IComponent) : IMessage {

    event.selectorFocus = SelectorService.Instance.find(component.element);
    event.action = ECustomEvent.CHANGE_INPUT_NUMERIC;
    return event;
  }
}