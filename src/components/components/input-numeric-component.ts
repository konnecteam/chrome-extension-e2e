import { SelectorService } from '../../services/selector/selector-service';
import  componentName  from '../../constants/component-name';
import { ComponentModel } from '../../models/component-model';
import { ElementFinderService } from '../../services/finder/element-finder-service';
import elementsTagName from '../../constants/elements-tagName';
import actionEvents from '../../constants/action-events';
import { EventModel } from '../../models/event-model';


/**
 * Permet de gérer l'input numeric
 */
export class InputNumericComponent {

  /** Attribut title d'un HTMLELement */
  private static readonly _TITLE = 'title';

  /**
   * Verifie si c'est un input numeric et retourne le component associé
   */
  public static isInputNumeric(element : HTMLElement) : ComponentModel  {

    if (this._isNumericElement(element)) {

      const inputElement = this._isInputNumericElement(element);
      if (inputElement) {

        return { component: componentName.INPUTNUMERIC, element : inputElement as HTMLElement };
      }
    }
    return null;
  }

  /**
   * Verifie si c'est un input numeric et retourne le bon event
   */
  private static _isInputNumericElement(element : HTMLElement) : Element {

    return ElementFinderService.findElementChildWithTagNameAndAttribute(
      element.parentElement,
      elementsTagName.INPUT.toLocaleUpperCase(),
      this._TITLE
    );
  }

  /**
   * Verifie si c'est un input numeric element et retourne l'element
   */
  private static _isNumericElement(element : HTMLElement) : Element {

    return ElementFinderService.findParentElementWithTagName(
      element,
      elementsTagName.NUMERIC.toLocaleUpperCase(),
      5
    );
  }

  /**
   * Modification de l'event pour un input numeric
   */
  public static editInputNumericMessage(event : EventModel, component : ComponentModel) : EventModel {

    event.selectorFocus = SelectorService.find(component.element);
    event.action = actionEvents.CHANGE_INPUTNUMERIC;
    return event;
  }
}