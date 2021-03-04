import { SelectorService } from '../../services/selector/selector-service';
import  componentName  from '../../constants/component-name';
import { IComponent } from '../../interfaces/i-component';
import { ElementService } from '../../services/element/element-service';
import actionEvents from '../../constants/action-events';
import { IMessage } from '../../interfaces/i-message';


/**
 * Permet de gérer l'input numeric
 */
export class InputNumericComponent {

  /**
   * Verifie si c'est un input numeric et retourne le component associé
   */
  public static isInputNumeric(element : HTMLElement) : IComponent  {

    if (ElementService.isNumericElement(element)) {

      const inputElement = ElementService.isInputNumericElement(element);
      if (inputElement) {

        return { component: componentName.INPUTNUMERIC, element : inputElement as HTMLElement };
      }
    }
    return null;
  }

  /**
   * Modification de l'event pour un input numeric
   */
  public static editInputNumericMessage(event : IMessage, component : IComponent) : IMessage {

    event.selectorFocus = SelectorService.find(component.element);
    event.action = actionEvents.CHANGE_INPUTNUMERIC;
    return event;
  }
}